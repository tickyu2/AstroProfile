import { QiPhysicsConsole } from '../components/qi/QiPhysicsConsole';

export default {
  title: 'Qi/QiPhysicsConsole',
  component: QiPhysicsConsole,
  decorators: [(Story) => <div className="max-w-xl p-4 bg-slate-900"><Story /></div>],
};

const SAMPLE_STEPS = [
  { label: 'Step 1: Natal Qi', detail: 'Stem + Branch hidden stems → raw per-pillar Qi', qi: { Wood: 2.1, Fire: 6.0, Earth: 4.5, Metal: 0.5, Water: 1.9 }, totalQi: 15.0 },
  { label: 'Step 2: Seasonal Adjustment', detail: 'Spring: Wood x1.0, Fire x0.4, Earth x0.6, Metal x0.2, Water x0.8', qi: { Wood: 2.1, Fire: 2.4, Earth: 2.7, Metal: 0.1, Water: 1.52 }, totalQi: 8.82 },
  { label: 'Step 3: Polarity Modifiers', detail: 'Yang DM: Yang elements x1.2, Yin x0.8', qi: { Wood: 2.52, Fire: 2.88, Earth: 2.7, Metal: 0.1, Water: 1.82 }, totalQi: 10.02 },
  { label: 'Step 4: Year Qi', detail: 'Year pillar 壬寅 contributes 20pts season-adjusted', qi: { Wood: 4.2, Fire: 3.1, Earth: 2.8, Metal: 0.2, Water: 3.5 }, totalQi: 13.8 },
  { label: 'Step 5: Month Qi', detail: 'Month pillar 甲辰 contributes 10pts', qi: { Wood: 5.5, Fire: 3.3, Earth: 4.2, Metal: 0.3, Water: 3.7 }, totalQi: 17.0 },
  { label: 'Step 6: Combined Qi', detail: 'Seasonal + Year + Month merged', qi: { Wood: 5.5, Fire: 3.3, Earth: 4.2, Metal: 0.3, Water: 3.7 }, totalQi: 17.0 },
  { label: 'Step 7: Clash Damage', detail: 'No clashes this month', qi: { Wood: 5.5, Fire: 3.3, Earth: 4.2, Metal: 0.3, Water: 3.7 }, totalQi: 17.0 },
  { label: 'Step 8: Control Cycle', detail: 'Wood→Earth pressure: Earth -0.5', qi: { Wood: 5.5, Fire: 3.3, Earth: 3.7, Metal: 0.3, Water: 3.7 }, totalQi: 16.5 },
  { label: 'Step 9: Final Functional Qi', detail: 'TotalQi = post-control result', qi: { Wood: 5.5, Fire: 3.3, Earth: 3.7, Metal: 0.3, Water: 3.7 }, totalQi: 16.5 },
];

export const FullPipeline = {
  args: {
    steps: SAMPLE_STEPS,
    interactions: [
      { type: 'Harm', branches: ['寅', '巳'], description: 'Tiger-Snake harm reduces Fire by 15%' },
    ],
    collapseInfo: { mode: 'none' },
    yongShen: { status: 'balanced', usefulElements: ['Water'], forbidden: [] },
  },
};

export const WithCollapse = {
  args: {
    steps: SAMPLE_STEPS.slice(0, 5),
    interactions: [],
    collapseInfo: { mode: 'single-dominant', primary: 'Fire', primaryShare: 0.574 },
    yongShen: { status: 'collapse_override', usefulElements: ['Fire', 'Earth'], forbidden: ['Water'] },
  },
};

export const MinimalSteps = {
  args: {
    steps: SAMPLE_STEPS.slice(0, 3),
  },
};
