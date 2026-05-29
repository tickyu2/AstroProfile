import { BraceletEvolutionTimeline } from '../components/qi/BraceletEvolutionTimeline';

export default {
  title: 'Qi/BraceletEvolutionTimeline',
  component: BraceletEvolutionTimeline,
  decorators: [(Story) => <div className="max-w-xl p-4 bg-slate-900"><Story /></div>],
};

const MONTH_DATA = [
  {
    month: 'Feb',
    beads: [
      { element: 'Fire', count: 5 },
      { element: 'Earth', count: 4 },
      { element: 'Wood', count: 1 },
      { element: 'Metal', count: 0 },
      { element: 'Water', count: 0 },
    ],
    score: 82,
    collapseMode: 'single',
    yongShen: ['Fire', 'Earth'],
    forbidden: ['Water'],
    scoreBreakdown: { YS: 28, Pol: 18, Sheng: 16, Forb: 15, Div: 5 },
  },
  {
    month: 'Mar',
    beads: [
      { element: 'Fire', count: 4 },
      { element: 'Earth', count: 4 },
      { element: 'Wood', count: 2 },
      { element: 'Metal', count: 0 },
      { element: 'Water', count: 0 },
    ],
    score: 78,
    collapseMode: 'single',
    yongShen: ['Fire', 'Earth'],
    forbidden: ['Water'],
    scoreBreakdown: { YS: 26, Pol: 17, Sheng: 15, Forb: 15, Div: 5 },
  },
  {
    month: 'Apr',
    beads: [
      { element: 'Fire', count: 3 },
      { element: 'Earth', count: 3 },
      { element: 'Wood', count: 2 },
      { element: 'Metal', count: 1 },
      { element: 'Water', count: 1 },
    ],
    score: 71,
    collapseMode: null,
    yongShen: ['Earth', 'Metal'],
    forbidden: [],
    scoreBreakdown: { YS: 22, Pol: 16, Sheng: 14, Forb: 10, Div: 9 },
  },
  {
    month: 'May',
    beads: [
      { element: 'Fire', count: 5 },
      { element: 'Earth', count: 3 },
      { element: 'Wood', count: 1 },
      { element: 'Metal', count: 1 },
      { element: 'Water', count: 0 },
    ],
    score: 85,
    collapseMode: 'single',
    yongShen: ['Fire', 'Earth'],
    forbidden: ['Water'],
    scoreBreakdown: { YS: 30, Pol: 18, Sheng: 17, Forb: 15, Div: 5 },
  },
  {
    month: 'Jun',
    beads: [
      { element: 'Fire', count: 4 },
      { element: 'Earth', count: 4 },
      { element: 'Wood', count: 1 },
      { element: 'Metal', count: 1 },
      { element: 'Water', count: 0 },
    ],
    score: 80,
    collapseMode: 'single',
    yongShen: ['Fire', 'Earth'],
    forbidden: ['Water'],
  },
  {
    month: 'Jul',
    beads: [
      { element: 'Earth', count: 4 },
      { element: 'Metal', count: 3 },
      { element: 'Fire', count: 2 },
      { element: 'Water', count: 1 },
      { element: 'Wood', count: 0 },
    ],
    score: 68,
    collapseMode: null,
    yongShen: ['Metal', 'Water'],
    forbidden: [],
  },
];

export const SixMonths = {
  args: { months: MONTH_DATA },
};

export const ThreeMonths = {
  args: { months: MONTH_DATA.slice(0, 3) },
};

export const FullYear = {
  args: {
    months: [
      ...MONTH_DATA,
      { month: 'Aug', beads: [{ element: 'Earth', count: 5 }, { element: 'Metal', count: 3 }, { element: 'Fire', count: 2 }], score: 72, yongShen: ['Earth'] },
      { month: 'Sep', beads: [{ element: 'Metal', count: 4 }, { element: 'Earth', count: 3 }, { element: 'Water', count: 2 }, { element: 'Fire', count: 1 }], score: 75, yongShen: ['Metal', 'Water'] },
      { month: 'Oct', beads: [{ element: 'Metal', count: 5 }, { element: 'Water', count: 3 }, { element: 'Earth', count: 2 }], score: 70, yongShen: ['Metal'] },
      { month: 'Nov', beads: [{ element: 'Water', count: 4 }, { element: 'Metal', count: 3 }, { element: 'Wood', count: 2 }, { element: 'Fire', count: 1 }], score: 65, yongShen: ['Water', 'Wood'] },
      { month: 'Dec', beads: [{ element: 'Water', count: 5 }, { element: 'Wood', count: 3 }, { element: 'Fire', count: 2 }], score: 74, collapseMode: null, yongShen: ['Water'] },
      { month: 'Jan', beads: [{ element: 'Fire', count: 5 }, { element: 'Earth', count: 4 }, { element: 'Wood', count: 1 }], score: 83, collapseMode: 'single', yongShen: ['Fire', 'Earth'], forbidden: ['Water'] },
    ],
  },
};
