import { ElementBadge } from '../components/qi/ElementBadge';

export default {
  title: 'Qi/ElementBadge',
  component: ElementBadge,
  decorators: [(Story) => <div className="flex gap-2 p-4 bg-slate-900"><Story /></div>],
};

export const AllElements = {
  render: () => (
    <>
      <ElementBadge element="Wood" />
      <ElementBadge element="Fire" />
      <ElementBadge element="Earth" />
      <ElementBadge element="Metal" />
      <ElementBadge element="Water" />
    </>
  ),
};

export const WithPercentages = {
  render: () => (
    <>
      <ElementBadge element="Fire">Fire 57%</ElementBadge>
      <ElementBadge element="Earth">Earth 18%</ElementBadge>
      <ElementBadge element="Wood">Wood 22%</ElementBadge>
    </>
  ),
};

export const SingleBadge = {
  args: {
    element: 'Water',
    children: 'Water 35%',
  },
};
