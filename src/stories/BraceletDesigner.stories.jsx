import { BraceletDesigner } from '../components/qi/BraceletDesigner';

export default {
  title: 'Qi/BraceletDesigner',
  component: BraceletDesigner,
  decorators: [(Story) => <div className="max-w-2xl p-4 bg-slate-900"><Story /></div>],
};

export const Empty = {
  args: {},
};

export const PrePopulated = {
  args: {
    initialSlots: [
      { element: 'Fire' }, { element: 'Earth' }, { element: 'Fire' },
      { element: 'Earth' }, { element: 'Wood' }, { element: 'Fire' },
      { element: 'Earth' }, { element: 'Fire' }, { element: 'Earth' },
      { element: 'Wood' }, { element: 'Fire' }, { element: null },
      { element: null }, { element: null }, { element: null },
      { element: null }, { element: null }, { element: null },
      { element: null }, { element: null }, { element: null },
    ],
  },
};

export const FullBracelet = {
  args: {
    initialSlots: Array.from({ length: 21 }, (_, i) => ({
      element: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'][i % 5],
    })),
  },
};
