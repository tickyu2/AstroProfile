/**
 * Cathedral UI Types
 *
 * Type definitions for Cathedral visualization components
 */

/**
 * Single cell in the Harmonic Heatmap
 */
export interface HarmonicHeatmapCell {
  id: number;
  name: string;
  triggered: boolean;
  harmonyBoost: number;
  bonus: number;
  cluster: string;
  details?: string;
}

/**
 * Omniphonic metrics from the visualization engine
 */
export interface OmniphonicMetrics {
  omniphonicScore: number;
  activeChambers: number;
  totalChambers: number;
  activationRate: number;
  totalHarmonyBoost: number;
  totalBonus: number;
  familyScores: Record<string, FamilyScore>;
  strength: string;
  interpretation: string;
}

/**
 * Family-level scoring
 */
export interface FamilyScore {
  activeChambers: number;
  totalChambers: number;
  activationRate: number;
  harmonyBoost: number;
  bonus: number;
}

/**
 * Full harmony analysis result
 */
export interface HarmonyAnalysisResult {
  heatmap: HarmonicHeatmapCell[];
  omniphonicScore: number;
  metrics: OmniphonicMetrics;
  narrative: string;
  raw: {
    triggered: boolean;
    count: number;
    strength: string;
    flags: string[];
    totalBonus: number;
    harmonyBoost: number;
    detectors: Array<{
      name: string;
      triggered: boolean;
      bonus: number;
      harmonyBoost: number;
      flag: string;
      details: string;
    }>;
    interpretation: string;
  };
}

/**
 * Props for HarmonicHeatmap component
 */
export interface HarmonicHeatmapProps {
  heatmap: HarmonicHeatmapCell[];
  onCellClick?: (cell: HarmonicHeatmapCell) => void;
  columns?: number;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props for OmniphonicPanel component
 */
export interface OmniphonicPanelProps {
  heatmap: HarmonicHeatmapCell[];
  omniphonicScore: number;
  narrative: string;
  metrics?: OmniphonicMetrics;
  showNarrative?: boolean;
  showMetrics?: boolean;
}

/**
 * Props for ChamberDetail component
 */
export interface ChamberDetailProps {
  cell: HarmonicHeatmapCell | null;
}
