import { QiPlayground } from '../components/qi/QiPlayground';

export default {
  title: 'Qi/QiPlayground',
  component: QiPlayground,
  decorators: [(Story) => <div className="max-w-4xl p-4 bg-slate-900"><Story /></div>],
};

const mockMonths = [
  {
    monthName: 'January', season: 'Winter',
    functionalQi: { Wood: 12, Fire: 8, Earth: 20, Metal: 35, Water: 25 },
    steps: [
      { label: 'Natal TFQ', qi: { Wood: 18, Fire: 15, Earth: 22, Metal: 25, Water: 20 } },
      { label: 'Year Pillar', qi: { Wood: 5, Fire: 3, Earth: 8, Metal: 10, Water: 4 } },
      { label: 'Month Pillar', qi: { Wood: 7, Fire: 5, Earth: 12, Metal: 25, Water: 21 } },
    ],
    interactions: [],
    collapseInfo: null,
    yongShen: {
      status: 'needed',
      usefulElements: ['Water', 'Wood'],
      forbidden: ['Fire'],
      reasoning: 'Metal excess needs Water drain and Wood control',
    },
  },
  {
    monthName: 'February', season: 'Winter',
    functionalQi: { Wood: 15, Fire: 10, Earth: 18, Metal: 30, Water: 27 },
    steps: [
      { label: 'Natal TFQ', qi: { Wood: 18, Fire: 15, Earth: 22, Metal: 25, Water: 20 } },
      { label: 'Month Pillar', qi: { Wood: 10, Fire: 7, Earth: 10, Metal: 22, Water: 27 } },
    ],
    interactions: [],
    collapseInfo: null,
    yongShen: {
      status: 'needed',
      usefulElements: ['Fire', 'Wood'],
      forbidden: [],
      reasoning: 'Cold season needs Fire warmth',
    },
  },
  {
    monthName: 'March', season: 'Spring',
    functionalQi: { Wood: 30, Fire: 12, Earth: 15, Metal: 20, Water: 23 },
    steps: [
      { label: 'Natal TFQ', qi: { Wood: 18, Fire: 15, Earth: 22, Metal: 25, Water: 20 } },
      { label: 'Month Pillar', qi: { Wood: 25, Fire: 10, Earth: 12, Metal: 15, Water: 18 } },
    ],
    interactions: [{ type: 'clash', elements: ['Wood', 'Metal'], description: 'Wood-Metal clash' }],
    collapseInfo: null,
    yongShen: {
      status: 'needed',
      usefulElements: ['Metal', 'Earth'],
      forbidden: ['Wood'],
      reasoning: 'Wood surge needs Metal control',
    },
  },
];

const mockQiMatrix = {
  months: mockMonths,
  dayMasterElement: 'Earth',
  dayMasterPolarity: 'Yang',
};

const mockChart = {
  pillars: [
    { stem: { char: '甲' }, branch: { char: '子' } },
    { stem: { char: '丙' }, branch: { char: '寅' } },
    { stem: { char: '戊' }, branch: { char: '午' } },
    { stem: { char: '庚' }, branch: { char: '申' } },
  ],
};

const mockTfq = { Wood: 18, Fire: 15, Earth: 22, Metal: 25, Water: 20 };

export const Default = {
  args: {
    qiMatrix: mockQiMatrix,
    userTfq: mockTfq,
    chart: mockChart,
  },
};

export const NoData = {
  args: {
    qiMatrix: null,
    userTfq: null,
    chart: null,
  },
};

export const SingleMonth = {
  args: {
    qiMatrix: { ...mockQiMatrix, months: [mockMonths[0]] },
    userTfq: mockTfq,
    chart: mockChart,
  },
};
