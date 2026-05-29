import { ElementPressureChart } from '../components/qi/ElementPressureChart';
import { EducationModeWrapper } from '../components/qi/EducationModeWrapper';

export default {
  title: 'Qi/ElementPressureChart',
  component: ElementPressureChart,
  decorators: [(Story) => <div className="max-w-xl p-4 bg-slate-900"><Story /></div>],
};

const MONTH_NAMES = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

export const FirePressure = {
  args: {
    allMonthBracelets: MONTH_NAMES.map((label, i) => ({
      label,
      mffq: {
        Wood: 2 + Math.sin(i) * 2,
        Fire: 12 + Math.sin(i * 0.8) * 5,
        Earth: 5 + Math.cos(i) * 2,
        Metal: 2,
        Water: 3 + Math.cos(i * 1.2) * 2,
      },
    })),
    userTfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
  },
};

export const MetalPressure = {
  args: {
    allMonthBracelets: MONTH_NAMES.map((label, i) => ({
      label,
      mffq: {
        Wood: 3,
        Fire: 4,
        Earth: 5,
        Metal: 10 + Math.sin(i * 0.7) * 4,
        Water: 4,
      },
    })),
    userTfq: { Wood: 3.0, Fire: 4.0, Earth: 5.0, Metal: 12.0, Water: 4.0 },
  },
};

export const WithEducationMode = {
  render: () => (
    <EducationModeWrapper
      title="Dominant Element Pressure"
      description="Tracks the dominant natal element across 12 months. High bars = element surging beyond natal baseline. Low bars = element weakened by seasonal influence."
    >
      <ElementPressureChart
        allMonthBracelets={MONTH_NAMES.map((label, i) => ({
          label,
          mffq: {
            Wood: 2 + Math.sin(i) * 2,
            Fire: 12 + Math.sin(i * 0.8) * 5,
            Earth: 5 + Math.cos(i) * 2,
            Metal: 2,
            Water: 3 + Math.cos(i * 1.2) * 2,
          },
        }))}
        userTfq={{ Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 }}
      />
    </EducationModeWrapper>
  ),
};
