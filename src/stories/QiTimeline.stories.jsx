import { QiTimeline } from '../components/qi/QiTimeline';

export default {
  title: 'Qi/QiTimeline',
  component: QiTimeline,
  decorators: [(Story) => <div className="max-w-2xl p-4 bg-slate-900"><Story /></div>],
};

const months = [
  { month: 'Jan', season: 'Winter', mffq: { Wood: 12, Fire: 8, Earth: 20, Metal: 35, Water: 25 } },
  { month: 'Feb', season: 'Winter', mffq: { Wood: 15, Fire: 10, Earth: 18, Metal: 30, Water: 27 } },
  { month: 'Mar', season: 'Spring', mffq: { Wood: 30, Fire: 12, Earth: 15, Metal: 20, Water: 23 } },
  { month: 'Apr', season: 'Spring', mffq: { Wood: 35, Fire: 18, Earth: 12, Metal: 15, Water: 20 } },
  { month: 'May', season: 'Spring', mffq: { Wood: 28, Fire: 25, Earth: 18, Metal: 12, Water: 17 } },
  { month: 'Jun', season: 'Summer', mffq: { Wood: 20, Fire: 35, Earth: 20, Metal: 10, Water: 15 } },
  { month: 'Jul', season: 'Summer', mffq: { Wood: 15, Fire: 40, Earth: 22, Metal: 8, Water: 15 } },
  { month: 'Aug', season: 'Summer', mffq: { Wood: 18, Fire: 32, Earth: 25, Metal: 10, Water: 15 } },
  { month: 'Sep', season: 'Autumn', mffq: { Wood: 12, Fire: 18, Earth: 28, Metal: 25, Water: 17 } },
  { month: 'Oct', season: 'Autumn', mffq: { Wood: 10, Fire: 12, Earth: 20, Metal: 35, Water: 23 } },
  { month: 'Nov', season: 'Autumn', mffq: { Wood: 8, Fire: 10, Earth: 18, Metal: 38, Water: 26 } },
  { month: 'Dec', season: 'Winter', mffq: { Wood: 10, Fire: 8, Earth: 15, Metal: 30, Water: 37 } },
];

const tfq = { Wood: 18, Fire: 15, Earth: 22, Metal: 25, Water: 20 };

export const Default = {
  args: { data: months },
};

export const WithBaseline = {
  args: { data: months, userTfq: tfq },
};

export const FewMonths = {
  args: {
    data: months.slice(0, 4),
    userTfq: tfq,
  },
};
