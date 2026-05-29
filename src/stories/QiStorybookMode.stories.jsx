import { QiStorybookMode } from '../components/qi/QiStorybookMode';

export default {
  title: 'Qi/QiStorybookMode',
  component: QiStorybookMode,
  decorators: [(Story) => <div className="max-w-2xl p-4 bg-slate-900"><Story /></div>],
};

export const FireCollapseMonth = {
  args: {
    monthName: 'February',
    season: 'Spring',
    mffq: { Wood: 3.5, Fire: 15.2, Earth: 7.8, Metal: 1.2, Water: 2.5 },
    userTfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
    yongShen: {
      status: 'collapse_override',
      usefulElements: ['Fire', 'Earth'],
      forbidden: ['Water'],
    },
    braceletRatios: { Wood: 1, Fire: 5, Earth: 4, Metal: 0, Water: 0 },
    collapseMode: 'single-dominant',
  },
};

export const BalancedSummer = {
  args: {
    monthName: 'June',
    season: 'Summer',
    mffq: { Wood: 5.0, Fire: 6.5, Earth: 5.2, Metal: 4.8, Water: 4.5 },
    userTfq: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
    yongShen: {
      status: 'balanced',
      usefulElements: ['Water'],
      forbidden: [],
    },
    braceletRatios: { Wood: 2, Fire: 1, Earth: 2, Metal: 3, Water: 3 },
    collapseMode: 'none',
  },
};

export const DrainedWinter = {
  args: {
    monthName: 'December',
    season: 'Winter',
    mffq: { Wood: 8.0, Fire: 7.0, Earth: 6.0, Metal: 0.5, Water: 5.0 },
    userTfq: { Wood: 8.0, Fire: 7.0, Earth: 6.5, Metal: 0.3, Water: 5.0 },
    yongShen: {
      status: 'collapse_override',
      usefulElements: ['Earth', 'Metal'],
      forbidden: [],
    },
    braceletRatios: { Wood: 0, Fire: 0, Earth: 4, Metal: 5, Water: 1 },
    collapseMode: 'drained',
  },
};

export const BiPolarAutumn = {
  args: {
    monthName: 'October',
    season: 'Autumn',
    mffq: { Wood: 10.5, Fire: 1.0, Earth: 2.0, Metal: 10.0, Water: 2.5 },
    userTfq: { Wood: 11.0, Fire: 1.0, Earth: 1.5, Metal: 10.5, Water: 2.0 },
    yongShen: {
      status: 'collapse_override',
      usefulElements: ['Water'],
      forbidden: ['Fire'],
    },
    braceletRatios: { Wood: 1, Fire: 0, Earth: 2, Metal: 2, Water: 5 },
    collapseMode: 'bi-polar',
  },
};
