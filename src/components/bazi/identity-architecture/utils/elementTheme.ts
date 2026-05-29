/**
 * Element Theme — gradients, colors, icons for Identity Architecture UI
 */

import { ELEMENT_COLORS } from '../../../../utils/baziWheels';
import type { Element } from '../engine/identityTypes';

export { ELEMENT_COLORS };

export const ELEMENT_GRADIENTS: Record<Element, string> = {
  Wood:  'linear-gradient(135deg, rgba(20,83,45,0.35) 0%, rgba(34,197,94,0.12) 100%)',
  Fire:  'linear-gradient(135deg, rgba(127,29,29,0.35) 0%, rgba(239,68,68,0.12) 100%)',
  Earth: 'linear-gradient(135deg, rgba(120,53,15,0.35) 0%, rgba(234,179,8,0.12) 100%)',
  Metal: 'linear-gradient(135deg, rgba(31,41,55,0.4) 0%, rgba(156,163,175,0.12) 100%)',
  Water: 'linear-gradient(135deg, rgba(12,74,110,0.35) 0%, rgba(59,130,246,0.12) 100%)',
};

export const ELEMENT_ICONS: Record<Element, string> = {
  Wood: '\u{1F333}', Fire: '\u{1F525}', Earth: '\u26F0\uFE0F', Metal: '\u2699\uFE0F', Water: '\u{1F4A7}',
};

export const PILLAR_ROLE_LABELS: Record<string, string> = {
  Year: 'Public Self (0\u201316)',
  Month: 'Work Self (17\u201332)',
  Day: 'True Self (33\u201348)',
  Hour: 'Future Self (49+)',
};

export const PILLAR_SHORT_LABELS = ['Y', 'M', 'D', 'H'] as const;
export const PILLAR_NAMES = ['Year', 'Month', 'Day', 'Hour'] as const;
