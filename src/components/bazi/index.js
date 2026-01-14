/**
 * BaZi Components Index
 * Exports all BaZi-related visualization components
 *
 * Structure:
 * - Existing components (legacy)
 * - Modular components (atomic design - Copilot implementation)
 */

// ============================================
// EXISTING COMPONENTS (Legacy)
// ============================================

// DaYun - 10-Year Luck Pillars
export { default as DaYunPanel } from './DaYunPanel';
export {
  CurrentLuckSummary,
  PillarCard,
  PillarDetails,
  ElementFlowAnalysis,
  LiuNianCard
} from './DaYunPanel';

// Main BaZi Panel
export { default as BaZiPanel } from './BaZiPanel';

// Original Components
export { default as ElementalRadar } from './ElementalRadar';
export { default as ConstitutionalMetaphor } from './ConstitutionalMetaphor';
export { default as SeasonalQiTab } from './SeasonalQiTab';
export { default as ElementalBalanceMathFlaps } from './ElementalBalanceMathFlaps';
export { default as BaZiPartnerBreakdownPanel } from './BaZiPartnerBreakdownPanel';

// ============================================
// MODULAR COMPONENTS (Atomic Design)
// ============================================

// Theme
export {
  BaziThemeProvider,
  useBaziTheme,
  defaultBaziTheme,
  lightBaziTheme,
  getElementColor,
  getElementIcon
} from './theme/BaziTheme';

// Atoms
export { default as Stem } from './atoms/Stem';
export { default as Branch } from './atoms/Branch';
export { default as ElementBadge } from './atoms/ElementBadge';

// Molecules
export { default as ModularPillarCard } from './molecules/ModularPillarCard';

// Organisms
export { default as FourPillarsGrid } from './organisms/FourPillarsGrid';
export { default as DayMasterCard } from './organisms/DayMasterCard';
export { default as ElementDistributionChart } from './organisms/ElementDistributionChart';

// Nivo Charts (Beautiful visualizations)
export { default as NivoElementBar } from './organisms/NivoElementBar';
export { default as ElementDonut } from './organisms/ElementDonut';
export { default as PersonalityRadar } from './organisms/PersonalityRadar';

// Explainability (Show Your Work)
export { default as ElementCalculationFlaps } from './organisms/ElementCalculationFlaps';

// Seasonality Analysis (四季土 Doctrine)
export { default as SeasonalityComparisonChart } from './organisms/SeasonalityComparisonChart';
export { default as SeasonalityPairComparison } from './organisms/SeasonalityPairComparison';
