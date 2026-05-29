import { BraceletAutoDesigner } from '../components/qi/BraceletAutoDesigner';

export default {
  title: 'Qi/BraceletAutoDesigner',
  component: BraceletAutoDesigner,
  decorators: [(Story) => <div className="max-w-xl p-4 bg-slate-900"><Story /></div>],
};

export const Default = {
  args: {
    yongShen: {
      usefulElements: ['Water', 'Metal'],
      forbidden: ['Fire'],
    },
    dayMasterStem: '甲',
  },
};

export const WithApply = {
  args: {
    yongShen: {
      usefulElements: ['Wood', 'Water'],
      forbidden: ['Earth'],
    },
    dayMasterStem: '丙',
    onApply: (seq) => console.log('Applied:', seq),
  },
};

export const EarthDayMaster = {
  args: {
    yongShen: {
      usefulElements: ['Fire', 'Earth'],
      forbidden: ['Wood'],
    },
    dayMasterStem: '戊',
  },
};
