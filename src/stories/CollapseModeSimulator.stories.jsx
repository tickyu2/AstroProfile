import { CollapseModeSimulator } from '../components/qi/CollapseModeSimulator';

export default {
  title: 'Qi/CollapseModeSimulator',
  component: CollapseModeSimulator,
  decorators: [(Story) => <div className="max-w-lg p-4 bg-slate-900"><Story /></div>],
};

export const Balanced = {
  args: {
    initialValues: { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 },
  },
};

export const FireDominant = {
  args: {
    initialValues: { Wood: 5, Fire: 55, Earth: 25, Metal: 5, Water: 10 },
  },
};

export const DrainedMetal = {
  args: {
    initialValues: { Wood: 25, Fire: 30, Earth: 25, Metal: 2, Water: 18 },
  },
};

export const Default = {};
