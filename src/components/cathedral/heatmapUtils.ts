/**
 * Heatmap Visualization Utilities
 *
 * Color and intensity helpers for the Harmonic Heatmap UI
 */

import { HarmonicHeatmapCell } from './types';

/**
 * Calculate normalized intensity from harmonyBoost + bonus
 *
 * @param cell - Heatmap cell
 * @returns Normalized intensity (0-1)
 */
export function cellIntensity(cell: HarmonicHeatmapCell): number {
  const raw = cell.harmonyBoost + cell.bonus;
  const max = 1.25; // approximate upper bound (0.85 + 0.40)
  return Math.min(raw / max, 1);
}

/**
 * Generate background color for a heatmap cell
 *
 * Triggered cells: Blue gradient based on intensity
 * Non-triggered cells: Grey
 *
 * @param cell - Heatmap cell
 * @returns CSS color string
 */
export function cellColor(cell: HarmonicHeatmapCell): string {
  if (!cell.triggered) {
    return 'rgba(40, 40, 50, 0.6)';
  }

  const intensity = cellIntensity(cell);

  // Color gradient from soft blue to vibrant purple-blue
  const r = Math.round(80 + (120 - 80) * (1 - intensity));
  const g = Math.round(100 + (80 - 100) * intensity);
  const b = Math.round(180 + (255 - 180) * intensity);
  const alpha = 0.4 + intensity * 0.5;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Generate border color for a heatmap cell
 *
 * @param cell - Heatmap cell
 * @param isSelected - Whether the cell is currently selected
 * @returns CSS color string
 */
export function cellBorderColor(cell: HarmonicHeatmapCell, isSelected: boolean = false): string {
  if (isSelected) {
    return 'rgba(255, 215, 0, 0.9)'; // Gold for selected
  }

  if (!cell.triggered) {
    return 'rgba(60, 60, 70, 0.4)';
  }

  const intensity = cellIntensity(cell);
  return `rgba(100, 120, 255, ${0.3 + intensity * 0.4})`;
}

/**
 * Generate text color for a heatmap cell
 *
 * @param cell - Heatmap cell
 * @returns CSS color string
 */
export function cellTextColor(cell: HarmonicHeatmapCell): string {
  if (!cell.triggered) {
    return 'rgba(150, 150, 160, 0.7)';
  }

  const intensity = cellIntensity(cell);
  return `rgba(255, 255, 255, ${0.7 + intensity * 0.3})`;
}

/**
 * Get strength label based on omniphonic score
 *
 * @param score - Omniphonic score (0-100)
 * @returns Strength label
 */
export function getStrengthLabel(score: number): string {
  if (score >= 80) return 'Exceptional';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Emerging';
  return 'Developing';
}

/**
 * Get color for omniphonic score display
 *
 * @param score - Omniphonic score (0-100)
 * @returns CSS color string
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#a78bfa'; // Purple - exceptional
  if (score >= 60) return '#60a5fa'; // Blue - strong
  if (score >= 40) return '#34d399'; // Green - moderate
  if (score >= 20) return '#fbbf24'; // Yellow - emerging
  return '#9ca3af'; // Gray - developing
}

/**
 * Get icon for family activation level
 *
 * @param activationRate - Family activation percentage
 * @returns Emoji icon
 */
export function getFamilyIcon(activationRate: number): string {
  if (activationRate >= 80) return '🌟';
  if (activationRate >= 60) return '✓';
  if (activationRate >= 40) return '◐';
  if (activationRate >= 20) return '○';
  return '·';
}

/**
 * Cluster color mapping for visual grouping
 */
export const CLUSTER_COLORS: Record<string, string> = {
  Resonance: '#a78bfa',
  Safety: '#60a5fa',
  Priorities: '#34d399',
  Reciprocity: '#fbbf24',
  Communication: '#f472b6',
  Rhythm: '#818cf8',
  Stability: '#22d3ee',
  Repair: '#a3e635',
  Trust: '#fb923c',
  Intimacy: '#e879f9',
  Meaning: '#c084fc',
  Prediction: '#38bdf8',
  Salience: '#4ade80',
  Clarity: '#facc15',
  'Context-Flow': '#fb7185',
  Regulation: '#a78bfa',
  Motivation: '#60a5fa',
  Desire: '#f472b6',
  Initiative: '#34d399',
  Commitment: '#fbbf24',
  Vulnerability: '#e879f9',
  Resilience: '#22d3ee',
  Equilibrium: '#a3e635',
  Presence: '#818cf8',
  Tempo: '#fb923c',
  Boundaries: '#38bdf8',
  Transparency: '#c084fc',
  Expectations: '#4ade80',
  Timing: '#facc15',
  Responsiveness: '#fb7185',
  'Initiative-Response': '#a78bfa',
  Attunement: '#60a5fa',
  'Co-Regulation': '#34d399',
  'Repair-Rhythm': '#a3e635',
  'Trust-Renewal': '#fb923c',
  'Meaning-Reinforcement': '#c084fc',
  Identity: '#e879f9',
  Purpose: '#818cf8',
  Values: '#22d3ee',
  'Life-Path': '#fbbf24',
  Legacy: '#f472b6',
  Mythos: '#a78bfa',
  Archetype: '#60a5fa',
  'Symbolic-Language': '#c084fc',
  Ritual: '#34d399',
  Seasonal: '#38bdf8',
  Evolution: '#4ade80',
  Destiny: '#facc15',
  Transcendence: '#fb7185',
  Omniphonic: '#e879f9'
};

/**
 * Get cluster-specific color
 *
 * @param cluster - Cluster name
 * @returns CSS color string
 */
export function getClusterColor(cluster: string): string {
  return CLUSTER_COLORS[cluster] || '#9ca3af';
}
