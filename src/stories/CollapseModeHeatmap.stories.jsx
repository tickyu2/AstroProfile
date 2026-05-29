import { CollapseModeHeatmap } from '../components/qi/CollapseModeHeatmap';

export default {
  title: 'Qi/CollapseModeHeatmap',
  component: CollapseModeHeatmap,
  decorators: [(Story) => <div className="max-w-2xl p-4 bg-slate-900"><Story /></div>],
};

const monthsData = [
  { month: 'Jan', mode: 'none', dominant: null },
  { month: 'Feb', mode: 'none', dominant: null },
  { month: 'Mar', mode: 'single-dominant', dominant: 'Wood' },
  { month: 'Apr', mode: 'single-dominant', dominant: 'Wood' },
  { month: 'May', mode: 'none', dominant: null },
  { month: 'Jun', mode: 'bi-polar', dominant: 'Fire' },
  { month: 'Jul', mode: 'single-dominant', dominant: 'Fire' },
  { month: 'Aug', mode: 'none', dominant: null },
  { month: 'Sep', mode: 'none', dominant: null },
  { month: 'Oct', mode: 'drained', dominant: 'Metal' },
  { month: 'Nov', mode: 'none', dominant: null },
  { month: 'Dec', mode: 'inverted', dominant: 'Water' },
];

export const Default = {
  args: { months: monthsData },
};

export const AllBalanced = {
  args: {
    months: monthsData.map(m => ({ ...m, mode: 'none', dominant: null })),
  },
};

export const HighCollapse = {
  args: {
    months: monthsData.map((m, i) => ({
      ...m,
      mode: i % 2 === 0 ? 'single-dominant' : 'bi-polar',
      dominant: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'][i % 5],
    })),
  },
};
