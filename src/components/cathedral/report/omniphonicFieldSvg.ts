/**
 * Omniphonic Field Diagram SVG Generator
 *
 * Creates a radial visualization of the 50-chamber harmonic field:
 * - Central circle: Omniphonic Score
 * - Surrounding rings: Harmonic family clusters
 * - Dots: Individual chambers with intensity shading
 *
 * Supports both light and dark themes.
 */

import { HarmonicHeatmapCell } from '../types';

export interface FieldSvgOptions {
  width?: number;
  height?: number;
  theme?: 'light' | 'dark';
  showLabels?: boolean;
  showScore?: boolean;
}

/**
 * Cluster colors for the radial diagram
 */
const CLUSTER_COLORS: Record<string, string> = {
  Foundation: '#6366f1',   // Indigo
  Flow: '#8b5cf6',         // Violet
  Communication: '#a855f7', // Purple
  Meaning: '#d946ef',       // Fuchsia
  Regulation: '#ec4899',    // Pink
  Connection: '#f43f5e',    // Rose
  Drive: '#f97316',         // Orange
  Repair: '#eab308',        // Yellow
  Identity: '#22c55e',      // Green
  Transcendence: '#06b6d4'  // Cyan
};

/**
 * Map clusters to families for grouping
 */
const CLUSTER_TO_FAMILY: Record<string, string> = {
  Resonance: 'Foundation',
  Safety: 'Foundation',
  Stability: 'Foundation',
  Trust: 'Foundation',
  Reciprocity: 'Flow',
  Rhythm: 'Flow',
  Tempo: 'Flow',
  Timing: 'Flow',
  Responsiveness: 'Flow',
  Communication: 'Communication',
  Clarity: 'Communication',
  Transparency: 'Communication',
  'Symbolic-Language': 'Communication',
  Meaning: 'Meaning',
  Prediction: 'Meaning',
  Salience: 'Meaning',
  'Context-Flow': 'Meaning',
  'Meaning-Reinforcement': 'Meaning',
  Regulation: 'Regulation',
  'Co-Regulation': 'Regulation',
  Equilibrium: 'Regulation',
  Boundaries: 'Regulation',
  Intimacy: 'Connection',
  Vulnerability: 'Connection',
  Presence: 'Connection',
  Attunement: 'Connection',
  Motivation: 'Drive',
  Desire: 'Drive',
  Initiative: 'Drive',
  Commitment: 'Drive',
  'Initiative-Response': 'Drive',
  Priorities: 'Drive',
  Repair: 'Repair',
  'Repair-Rhythm': 'Repair',
  'Trust-Renewal': 'Repair',
  Resilience: 'Repair',
  Expectations: 'Repair',
  Identity: 'Identity',
  Purpose: 'Identity',
  Values: 'Identity',
  'Life-Path': 'Identity',
  Legacy: 'Transcendence',
  Mythos: 'Transcendence',
  Archetype: 'Transcendence',
  Ritual: 'Transcendence',
  Seasonal: 'Transcendence',
  Evolution: 'Transcendence',
  Destiny: 'Transcendence',
  Transcendence: 'Transcendence',
  Omniphonic: 'Transcendence'
};

/**
 * Build the Omniphonic Field SVG diagram
 */
export function buildOmniphonicFieldSvg(
  heatmap: HarmonicHeatmapCell[],
  omniphonicScore: number,
  options: FieldSvgOptions = {}
): string {
  const {
    width = 500,
    height = 500,
    theme = 'light',
    showLabels = true,
    showScore = true
  } = options;

  const cx = width / 2;
  const cy = height / 2;

  // Theme colors
  const colors = theme === 'dark' ? {
    bg: 'transparent',
    text: '#f5f5ff',
    textMuted: '#6b6b8a',
    stroke: '#2a2c3a',
    accent: '#818cf8',
    dotActive: '#818cf8',
    dotInactive: 'rgba(107, 107, 138, 0.4)'
  } : {
    bg: 'transparent',
    text: '#111827',
    textMuted: '#9ca3af',
    stroke: '#e5e7eb',
    accent: '#4f46e5',
    dotActive: '#4f46e5',
    dotInactive: 'rgba(156, 163, 175, 0.4)'
  };

  // Get unique families
  const families = Array.from(new Set(Object.values(CLUSTER_TO_FAMILY)));
  const familyCount = families.length;

  // Ring configuration
  const innerRadius = 50;
  const outerRadius = Math.min(cx, cy) - 60;
  const ringGap = (outerRadius - innerRadius) / 4;

  // Build chamber positions
  const chamberPositions: Array<{
    cell: HarmonicHeatmapCell;
    x: number;
    y: number;
    family: string;
    angle: number;
    radius: number;
  }> = [];

  // Group chambers by family
  const familyGroups: Record<string, HarmonicHeatmapCell[]> = {};
  heatmap.forEach(cell => {
    const family = CLUSTER_TO_FAMILY[cell.cluster] || 'Foundation';
    if (!familyGroups[family]) familyGroups[family] = [];
    familyGroups[family].push(cell);
  });

  // Position chambers in radial layout
  families.forEach((family, familyIndex) => {
    const familyCells = familyGroups[family] || [];
    const baseAngle = (2 * Math.PI * familyIndex) / familyCount - Math.PI / 2;
    const angleSpread = (2 * Math.PI) / familyCount * 0.8;

    familyCells.forEach((cell, cellIndex) => {
      const cellAngle = baseAngle + (angleSpread * (cellIndex / Math.max(familyCells.length - 1, 1))) - angleSpread / 2;
      const ringIndex = Math.floor(cellIndex / Math.ceil(familyCells.length / 3));
      const radius = innerRadius + ringGap + ringIndex * ringGap * 0.8 + (Math.random() * 10 - 5);

      const x = cx + radius * Math.cos(cellAngle);
      const y = cy + radius * Math.sin(cellAngle);

      chamberPositions.push({
        cell,
        x,
        y,
        family,
        angle: cellAngle,
        radius
      });
    });
  });

  // Build SVG elements
  const ringElements = buildRings(cx, cy, innerRadius, outerRadius, ringGap, colors.stroke);
  const familyArcs = buildFamilyArcs(cx, cy, outerRadius - 10, families, CLUSTER_COLORS, colors.textMuted, showLabels);
  const chamberDots = buildChamberDots(chamberPositions, colors);
  const connectionLines = buildConnectionLines(chamberPositions, cx, cy, colors);
  const centerElement = buildCenterElement(cx, cy, innerRadius, omniphonicScore, colors, showScore);

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.accent}"/>
      <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0.6"/>
    </linearGradient>
  </defs>

  <g class="field-diagram">
    <!-- Background rings -->
    ${ringElements}

    <!-- Family arcs -->
    ${familyArcs}

    <!-- Connection lines (active chambers) -->
    ${connectionLines}

    <!-- Chamber dots -->
    ${chamberDots}

    <!-- Center score -->
    ${centerElement}
  </g>
</svg>
  `.trim();
}

/**
 * Build concentric rings
 */
function buildRings(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  ringGap: number,
  strokeColor: string
): string {
  const rings: string[] = [];
  for (let i = 0; i < 4; i++) {
    const r = innerRadius + i * ringGap;
    rings.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.3" />`);
  }
  // Outer ring
  rings.push(`<circle cx="${cx}" cy="${cy}" r="${outerRadius - 20}" fill="none" stroke="${strokeColor}" stroke-width="0.5" opacity="0.2" />`);
  return rings.join('\n    ');
}

/**
 * Build family arc labels
 */
function buildFamilyArcs(
  cx: number,
  cy: number,
  radius: number,
  families: string[],
  familyColors: Record<string, string>,
  textColor: string,
  showLabels: boolean
): string {
  if (!showLabels) return '';

  return families.map((family, index) => {
    const angle = (2 * Math.PI * index) / families.length - Math.PI / 2;
    const labelRadius = radius + 25;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);
    const color = familyColors[family] || '#888';

    // Adjust text anchor based on position
    let textAnchor = 'middle';
    if (angle > -Math.PI / 4 && angle < Math.PI / 4) textAnchor = 'start';
    if (angle > Math.PI * 3 / 4 || angle < -Math.PI * 3 / 4) textAnchor = 'end';

    return `
    <text x="${x.toFixed(1)}" y="${y.toFixed(1)}"
          font-size="9"
          font-weight="500"
          text-anchor="${textAnchor}"
          fill="${color}"
          opacity="0.8">
      ${family}
    </text>`;
  }).join('\n    ');
}

/**
 * Build chamber dots
 */
function buildChamberDots(
  positions: Array<{ cell: HarmonicHeatmapCell; x: number; y: number; family: string }>,
  colors: { dotActive: string; dotInactive: string }
): string {
  return positions.map(({ cell, x, y, family }) => {
    const intensity = cell.triggered
      ? Math.min((cell.harmonyBoost + cell.bonus) / 1.2, 1)
      : 0;

    const fillColor = cell.triggered
      ? CLUSTER_COLORS[family] || colors.dotActive
      : colors.dotInactive;

    const opacity = cell.triggered ? 0.5 + intensity * 0.5 : 0.3;
    const radius = cell.triggered ? 4 + intensity * 2 : 3;

    return `
    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"
            r="${radius}"
            fill="${fillColor}"
            fill-opacity="${opacity.toFixed(2)}"
            stroke="${fillColor}"
            stroke-width="${cell.triggered ? 1 : 0.5}"
            stroke-opacity="${cell.triggered ? 0.8 : 0.2}"
            ${cell.triggered ? 'filter="url(#glow)"' : ''}>
      <title>#${cell.id} ${cell.cluster}: ${cell.triggered ? 'Active' : 'Dormant'}</title>
    </circle>`;
  }).join('\n    ');
}

/**
 * Build connection lines from active chambers to center
 */
function buildConnectionLines(
  positions: Array<{ cell: HarmonicHeatmapCell; x: number; y: number; family: string }>,
  cx: number,
  cy: number,
  colors: { accent: string }
): string {
  return positions
    .filter(p => p.cell.triggered)
    .map(({ cell, x, y, family }) => {
      const intensity = Math.min((cell.harmonyBoost + cell.bonus) / 1.2, 1);
      const color = CLUSTER_COLORS[family] || colors.accent;

      return `
    <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"
          stroke="${color}"
          stroke-width="0.5"
          stroke-opacity="${(0.1 + intensity * 0.15).toFixed(2)}" />`;
    }).join('\n    ');
}

/**
 * Build center score element
 */
function buildCenterElement(
  cx: number,
  cy: number,
  radius: number,
  score: number,
  colors: { accent: string; text: string; textMuted: string; stroke: string },
  showScore: boolean
): string {
  const scoreArc = (score / 100) * 2 * Math.PI * (radius - 5);

  return `
    <!-- Center background -->
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${colors.stroke}" stroke-width="3" />

    <!-- Score arc -->
    <circle cx="${cx}" cy="${cy}" r="${radius - 5}"
            fill="none"
            stroke="url(#scoreGradient)"
            stroke-width="4"
            stroke-dasharray="${scoreArc.toFixed(1)} 1000"
            stroke-linecap="round"
            transform="rotate(-90 ${cx} ${cy})" />

    ${showScore ? `
    <!-- Score text -->
    <text x="${cx}" y="${cy - 6}"
          font-size="18"
          font-weight="700"
          text-anchor="middle"
          fill="${colors.accent}">
      ${score.toFixed(1)}
    </text>
    <text x="${cx}" y="${cy + 10}"
          font-size="8"
          text-anchor="middle"
          fill="${colors.textMuted}">
      Omniphonic
    </text>
    ` : ''}
  `;
}

export default buildOmniphonicFieldSvg;
