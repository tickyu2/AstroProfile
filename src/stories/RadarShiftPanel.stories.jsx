import { RadarShiftPanel } from '../components/qi/RadarShiftPanel';
import { EducationModeWrapper } from '../components/qi/EducationModeWrapper';

export default {
  title: 'Qi/RadarShiftPanel',
  component: RadarShiftPanel,
  decorators: [(Story) => <div className="max-w-md p-4 bg-slate-900"><Story /></div>],
};

export const NormalMonth = {
  args: {
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

export const DrainedMonth = {
  args: {
    radarShift: {
      tfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
      mffq: { Wood: 1.0, Fire: 8.0, Earth: 6.0, Metal: 3.5, Water: 5.5 },
      afterBracelet: { Wood: 1.5, Fire: 10.2, Earth: 7.5, Metal: 3.5, Water: 5.5 },
      delta: { Wood: 0.5, Fire: 2.2, Earth: 1.5, Metal: 0.0, Water: 0.0 },
      totalShiftPct: 4.2,
      monthType: 'drained',
    },
  },
};

export const OvercrowdedMonth = {
  args: {
    radarShift: {
      tfq: { Wood: 5.0, Fire: 5.0, Earth: 5.0, Metal: 5.0, Water: 5.0 },
      mffq: { Wood: 12.0, Fire: 3.0, Earth: 4.0, Metal: 2.0, Water: 4.0 },
      afterBracelet: { Wood: 11.0, Fire: 3.5, Earth: 4.5, Metal: 2.5, Water: 4.5 },
      delta: { Wood: -1.0, Fire: 0.5, Earth: 0.5, Metal: 0.5, Water: 0.5 },
      totalShiftPct: 3.0,
      monthType: 'overcrowded',
    },
  },
};

export const WithEducationMode = {
  render: () => (
    <EducationModeWrapper
      title="Bracelet Qi Influence"
      description="Three layers: faint = natal TFQ baseline, medium = current month TotalQi, bright = after bracelet correction. BRQ_A (35% gap correction) + BRQ_B (10% natal reinforcement), capped at 15% of TFQ per element."
    >
      <RadarShiftPanel
        radarShift={{
          tfq: { Wood: 2.1, Fire: 13.5, Earth: 9.0, Metal: 0.9, Water: 3.0 },
          mffq: { Wood: 3.5, Fire: 15.2, Earth: 7.8, Metal: 1.2, Water: 2.5 },
          afterBracelet: { Wood: 3.5, Fire: 16.0, Earth: 8.8, Metal: 1.2, Water: 2.5 },
          delta: { Wood: 0.0, Fire: 0.8, Earth: 1.0, Metal: 0.0, Water: 0.0 },
          totalShiftPct: 1.8,
          monthType: 'normal',
        }}
      />
    </EducationModeWrapper>
  ),
};
