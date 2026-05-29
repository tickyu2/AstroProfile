import { WhyThisRemedyPanel } from '../components/qi/WhyThisRemedyPanel';
import { EducationModeWrapper } from '../components/qi/EducationModeWrapper';

export default {
  title: 'Qi/WhyThisRemedyPanel',
  component: WhyThisRemedyPanel,
  decorators: [(Story) => <div className="max-w-md p-4 bg-slate-900"><Story /></div>],
};

export const SingleDominantCollapse = {
  args: {
    yongShen: {
      status: 'collapse_override',
      collapseMode: 'single-dominant',
      usefulElements: ['Fire', 'Earth'],
      forbidden: ['Water'],
    },
    dynamicPool: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
    userTfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
    bracelet: {
      ratios: { Wood: 0, Fire: 5, Earth: 5, Metal: 0, Water: 0 },
    },
  },
};

export const CriticalImbalance = {
  args: {
    yongShen: {
      status: 'critical_imbalance',
      collapseMode: null,
      usefulElements: ['Metal', 'Water'],
      forbidden: [],
    },
    dynamicPool: { Wood: 8.0, Fire: 7.0, Earth: 6.0, Metal: 1.0, Water: 2.0 },
    userTfq: { Wood: 8.0, Fire: 7.0, Earth: 6.0, Metal: 1.0, Water: 2.0 },
    bracelet: {
      ratios: { Wood: 0, Fire: 0, Earth: 1, Metal: 5, Water: 4 },
    },
  },
};

export const BalancedChart = {
  args: {
    yongShen: {
      status: 'balanced',
      collapseMode: null,
      usefulElements: ['Water'],
      forbidden: [],
    },
    dynamicPool: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
    userTfq: { Wood: 5.5, Fire: 6.0, Earth: 5.8, Metal: 5.2, Water: 4.8 },
    bracelet: {
      ratios: { Wood: 1, Fire: 1, Earth: 2, Metal: 2, Water: 4 },
    },
  },
};

export const WithEducationMode = {
  render: () => (
    <EducationModeWrapper
      title="Remedy Logic"
      description="Rx = prescribed (Yong Shen), X = forbidden, + = supporting role, - = neutral. Collapse structures use Follow-the-Strong logic instead of direct opposition."
    >
      <WhyThisRemedyPanel
        yongShen={{
          status: 'collapse_override',
          collapseMode: 'single-dominant',
          usefulElements: ['Fire', 'Earth'],
          forbidden: ['Water'],
        }}
        dynamicPool={{ Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 }}
        userTfq={{ Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 }}
        bracelet={{ ratios: { Wood: 0, Fire: 5, Earth: 5, Metal: 0, Water: 0 } }}
      />
    </EducationModeWrapper>
  ),
};
