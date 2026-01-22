/**
 * Cathedral Components - Index
 *
 * React components for visualizing the Cathedral relational diagnostic system.
 *
 * LUNA WING (Harmonic):
 * - HarmonicHeatmap: 50-chamber resonance grid
 * - ChamberDetail: Selected chamber information
 * - OmniphonicPanel: Full harmonic analysis panel
 *
 * SOLAR WING (Supernova):
 * - (Coming soon)
 */

// Components
export { default as HarmonicHeatmap } from './HarmonicHeatmap';
export { default as ChamberDetail } from './ChamberDetail';
export { default as OmniphonicPanel } from './OmniphonicPanel';

// Types
export type {
  HarmonicHeatmapCell,
  OmniphonicMetrics,
  FamilyScore,
  HarmonyAnalysisResult,
  HarmonicHeatmapProps,
  OmniphonicPanelProps,
  ChamberDetailProps
} from './types';

// Utilities
export {
  cellIntensity,
  cellColor,
  cellBorderColor,
  cellTextColor,
  getStrengthLabel,
  getScoreColor,
  getFamilyIcon,
  getClusterColor,
  CLUSTER_COLORS
} from './heatmapUtils';
