import { QiDebugger } from '../components/qi/QiDebugger';

export default {
  title: 'Qi/QiDebugger',
  component: QiDebugger,
  decorators: [(Story) => <div className="max-w-lg p-4 bg-slate-900"><Story /></div>],
};

export const FireDominant = {
  args: {
    tfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
    mffq: { Wood: 3.5, Fire: 15.2, Earth: 7.8, Metal: 1.2, Water: 2.5 },
    braceletQiUnits: { Wood: 0.0, Fire: 2.4, Earth: 1.8, Metal: 0.0, Water: 0.0 },
    collapseInfo: { isCollapse: true, mode: 'single-dominant', dominant: 'Fire' },
    yongShen: {
      status: 'collapse_override',
      usefulElements: ['Fire', 'Earth'],
      forbidden: ['Water'],
    },
    radarShift: {
      tfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
      mffq: { Wood: 3.5, Fire: 15.2, Earth: 7.8, Metal: 1.2, Water: 2.5 },
      afterBracelet: { Wood: 3.5, Fire: 16.0, Earth: 8.8, Metal: 1.2, Water: 2.5 },
      delta: { Wood: 0.0, Fire: 0.8, Earth: 1.0, Metal: 0.0, Water: 0.0 },
      totalShiftPct: 1.8,
      monthType: 'normal',
    },
  },
};

export const BalancedChart = {
  args: {
    tfq: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
    mffq: { Wood: 5.8, Fire: 5.5, Earth: 6.2, Metal: 5.0, Water: 4.5 },
    braceletQiUnits: { Wood: 0.5, Fire: 0.3, Earth: 0.4, Metal: 0.8, Water: 1.2 },
    yongShen: {
      status: 'balanced',
      usefulElements: ['Water'],
      forbidden: [],
    },
  },
};

export const MinimalProps = {
  args: {
    tfq: { Wood: 3.0, Fire: 8.0, Earth: 5.0, Metal: 2.0, Water: 4.0 },
    mffq: { Wood: 4.0, Fire: 10.0, Earth: 4.5, Metal: 1.5, Water: 3.0 },
  },
};
