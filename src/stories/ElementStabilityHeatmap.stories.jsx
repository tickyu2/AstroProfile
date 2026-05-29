import { ElementStabilityHeatmap } from '../components/qi/ElementStabilityHeatmap';
import { EducationModeWrapper } from '../components/qi/EducationModeWrapper';

export default {
  title: 'Qi/ElementStabilityHeatmap',
  component: ElementStabilityHeatmap,
  decorators: [(Story) => <div className="max-w-2xl p-4 bg-slate-900"><Story /></div>],
};

const MONTH_NAMES = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

const makeMffq = (overrides = {}) => ({
  Wood: 4 + Math.random() * 6,
  Fire: 5 + Math.random() * 10,
  Earth: 3 + Math.random() * 5,
  Metal: 2 + Math.random() * 4,
  Water: 2 + Math.random() * 5,
  ...overrides,
});

const months = MONTH_NAMES.map((label, i) => ({
  label,
  mffq: makeMffq(i < 3 ? { Fire: 14 + i * 2 } : {}),
  yongShen: { collapseMode: i < 3 ? 'singl' : null },
}));

export const FireDominant = {
  args: {
    allMonthBracelets: months,
    userTfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
  },
};

export const BalancedChart = {
  args: {
    allMonthBracelets: MONTH_NAMES.map(label => ({
      label,
      mffq: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
      yongShen: { collapseMode: null },
    })),
    userTfq: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
  },
};

export const WithEducationMode = {
  render: () => (
    <EducationModeWrapper
      title="Element Drift Heatmap"
      description="Shows how each element drifts from natal TFQ across 12 months. Green = stable, amber = excess, red = surge, blue = deficit."
    >
      <ElementStabilityHeatmap
        allMonthBracelets={months}
        userTfq={{ Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 }}
      />
    </EducationModeWrapper>
  ),
};
