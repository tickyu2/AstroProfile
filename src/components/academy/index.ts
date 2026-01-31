/**
 * Academy Components Barrel Export
 * Central export for all Zodiac Academy UI components
 */

// Pure Sign Components
export {
  PureSignPanel,
  PureSignCard,
  PureSignMiniBadge,
  ElementBadge,
  ModalityBadge,
  PolarityBadge,
  TraitTags
} from './PureSignPanel';

// Navigation Components
export {
  PureSignNavigation,
  PureSignNavCompact,
  ZodiacWheelMini,
  ElementTriadNav
} from './PureSignNavigation';

export {
  RitualNavigation,
  ChapterProgress,
  ChapterList,
  ChapterBreadcrumb,
  JourneyCompletion,
  ACADEMY_CHAPTERS
} from './RitualNavigation';

// Educational Components
export {
  WhyItMatters,
  WhyItMattersList,
  WhyPureSignMatters,
  WhyCuspMatters,
  WhyElementMatters,
  WhyModalityMatters,
  WhyPhiCurveMatters
} from './WhyItMatters';

export {
  ModalityPolaritySection,
  ModalitySection,
  PolaritySection
} from './ModalityPolaritySection';

// Cusp Components
export { CuspDayPanel, CuspDayCard, CuspDayMini } from './CuspDayPanel';

// Types re-export
export type { Chapter, RitualNavigationProps, ChapterProgressProps } from './RitualNavigation';
