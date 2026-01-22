/**
 * modeChartThemes.js
 *
 * Mode-specific chart visualization themes.
 * Defines colors, styles, and visual treatments for astrological charts
 * based on the current Cathedral mode.
 *
 * Part of GENESIS OS - Soul Discovery Engine
 */

// ============================================================================
// BASE COLOR PALETTES
// ============================================================================

const PALETTES = {
  warmGold: {
    primary: '#ffd780',
    secondary: '#e6b84d',
    accent: '#ffaa33',
    background: '#1a1520',
    surface: '#2a2030',
    text: '#fff5e6',
    textMuted: '#b8a080',
    glow: 'rgba(255, 215, 128, 0.4)',
  },
  parchment: {
    primary: '#e8d5a3',
    secondary: '#c4b08a',
    accent: '#d4a84b',
    background: '#1a1a20',
    surface: '#252520',
    text: '#f5f0e6',
    textMuted: '#94a3b8',
    glow: 'rgba(232, 213, 163, 0.3)',
  },
  blueprint: {
    primary: '#60a5fa',
    secondary: '#3b82f6',
    accent: '#93c5fd',
    background: '#0a0f1a',
    surface: '#101828',
    text: '#e2e8f0',
    textMuted: '#64748b',
    glow: 'rgba(96, 165, 250, 0.4)',
  },
  obsidianGold: {
    primary: '#fbbf24',
    secondary: '#d97706',
    accent: '#fcd34d',
    background: '#0a0a0f',
    surface: '#141418',
    text: '#fefce8',
    textMuted: '#a3a3a3',
    glow: 'rgba(251, 191, 36, 0.5)',
  },
};

// ============================================================================
// ELEMENT COLORS PER MODE
// ============================================================================

const ELEMENT_COLORS = {
  pilgrim: {
    fire: { fill: '#ff6b4a', stroke: '#ff8566', glow: 'rgba(255, 107, 74, 0.4)' },
    earth: { fill: '#8b7355', stroke: '#a08060', glow: 'rgba(139, 115, 85, 0.4)' },
    air: { fill: '#87ceeb', stroke: '#a0d8ef', glow: 'rgba(135, 206, 235, 0.4)' },
    water: { fill: '#4169e1', stroke: '#6080f0', glow: 'rgba(65, 105, 225, 0.4)' },
    wood: { fill: '#228b22', stroke: '#32a032', glow: 'rgba(34, 139, 34, 0.4)' },
    metal: { fill: '#c0c0c0', stroke: '#d4d4d4', glow: 'rgba(192, 192, 192, 0.4)' },
  },
  scholar: {
    fire: { fill: '#dc2626', stroke: '#ef4444', glow: 'rgba(220, 38, 38, 0.3)' },
    earth: { fill: '#78716c', stroke: '#a8a29e', glow: 'rgba(120, 113, 108, 0.3)' },
    air: { fill: '#0ea5e9', stroke: '#38bdf8', glow: 'rgba(14, 165, 233, 0.3)' },
    water: { fill: '#2563eb', stroke: '#3b82f6', glow: 'rgba(37, 99, 235, 0.3)' },
    wood: { fill: '#16a34a', stroke: '#22c55e', glow: 'rgba(22, 163, 74, 0.3)' },
    metal: { fill: '#9ca3af', stroke: '#d1d5db', glow: 'rgba(156, 163, 175, 0.3)' },
  },
  architect: {
    fire: { fill: '#f43f5e', stroke: '#fb7185', glow: 'rgba(244, 63, 94, 0.5)' },
    earth: { fill: '#a16207', stroke: '#ca8a04', glow: 'rgba(161, 98, 7, 0.5)' },
    air: { fill: '#06b6d4', stroke: '#22d3ee', glow: 'rgba(6, 182, 212, 0.5)' },
    water: { fill: '#6366f1', stroke: '#818cf8', glow: 'rgba(99, 102, 241, 0.5)' },
    wood: { fill: '#059669', stroke: '#10b981', glow: 'rgba(5, 150, 105, 0.5)' },
    metal: { fill: '#71717a', stroke: '#a1a1aa', glow: 'rgba(113, 113, 122, 0.5)' },
  },
  sovereign: {
    fire: { fill: '#fbbf24', stroke: '#fcd34d', glow: 'rgba(251, 191, 36, 0.5)' },
    earth: { fill: '#92400e', stroke: '#b45309', glow: 'rgba(146, 64, 14, 0.5)' },
    air: { fill: '#e0e7ff', stroke: '#c7d2fe', glow: 'rgba(224, 231, 255, 0.4)' },
    water: { fill: '#1e3a5f', stroke: '#1e40af', glow: 'rgba(30, 58, 95, 0.5)' },
    wood: { fill: '#064e3b', stroke: '#047857', glow: 'rgba(6, 78, 59, 0.5)' },
    metal: { fill: '#d4d4d8', stroke: '#e4e4e7', glow: 'rgba(212, 212, 216, 0.5)' },
  },
};

// ============================================================================
// PLANET SYMBOL STYLES PER MODE
// ============================================================================

const PLANET_STYLES = {
  pilgrim: {
    size: 'large',
    style: 'glyph',
    glow: true,
    animation: 'breath',
    opacity: 0.9,
  },
  scholar: {
    size: 'medium',
    style: 'glyph_annotated',
    glow: false,
    animation: 'none',
    opacity: 1.0,
    showDegrees: true,
    showSign: true,
  },
  architect: {
    size: 'small',
    style: 'code',
    glow: true,
    animation: 'pulse',
    opacity: 1.0,
    showDegrees: true,
    showSign: true,
    showSpeed: true,
  },
  sovereign: {
    size: 'medium',
    style: 'icon',
    glow: true,
    animation: 'command',
    opacity: 1.0,
    showKeyOnly: true,
  },
};

// ============================================================================
// ASPECT LINE STYLES PER MODE
// ============================================================================

const ASPECT_STYLES = {
  pilgrim: {
    conjunction: { color: '#ffd700', width: 2, dash: 'solid', glow: true },
    sextile: { color: '#87ceeb', width: 1, dash: 'dotted', glow: false },
    square: { color: '#ff6b6b', width: 2, dash: 'solid', glow: true },
    trine: { color: '#90ee90', width: 2, dash: 'solid', glow: true },
    opposition: { color: '#ff4444', width: 2, dash: 'dashed', glow: true },
    showLabels: false,
    showOrbs: false,
    animate: true,
  },
  scholar: {
    conjunction: { color: '#d97706', width: 2, dash: 'solid', glow: false },
    sextile: { color: '#0ea5e9', width: 1, dash: 'dotted', glow: false },
    square: { color: '#dc2626', width: 2, dash: 'solid', glow: false },
    trine: { color: '#16a34a', width: 2, dash: 'solid', glow: false },
    opposition: { color: '#be123c', width: 2, dash: 'dashed', glow: false },
    showLabels: true,
    showOrbs: true,
    animate: false,
    annotationStyle: 'academic',
  },
  architect: {
    conjunction: { color: '#fbbf24', width: 1, dash: 'solid', glow: true },
    sextile: { color: '#22d3ee', width: 1, dash: 'dotted', glow: false },
    square: { color: '#f43f5e', width: 1, dash: 'solid', glow: true },
    trine: { color: '#10b981', width: 1, dash: 'solid', glow: false },
    opposition: { color: '#ef4444', width: 1, dash: 'dashed', glow: true },
    showLabels: true,
    showOrbs: true,
    showExactDegrees: true,
    animate: false,
    gridOverlay: true,
  },
  sovereign: {
    conjunction: { color: '#fcd34d', width: 3, dash: 'solid', glow: true },
    sextile: { color: '#94a3b8', width: 1, dash: 'dotted', glow: false },
    square: { color: '#fbbf24', width: 2, dash: 'solid', glow: true },
    trine: { color: '#fbbf24', width: 2, dash: 'solid', glow: true },
    opposition: { color: '#dc2626', width: 3, dash: 'dashed', glow: true },
    showLabels: false,
    showOrbs: false,
    animate: true,
    showKeyAspectsOnly: true,
  },
};

// ============================================================================
// HOUSE STYLES PER MODE
// ============================================================================

const HOUSE_STYLES = {
  pilgrim: {
    lineColor: 'rgba(255, 215, 128, 0.3)',
    lineWidth: 1,
    labelColor: '#b8a080',
    labelSize: 12,
    showCusps: false,
    highlightAngles: true,
    angleGlow: 'rgba(255, 215, 128, 0.5)',
  },
  scholar: {
    lineColor: 'rgba(232, 213, 163, 0.4)',
    lineWidth: 1,
    labelColor: '#94a3b8',
    labelSize: 11,
    showCusps: true,
    showDegrees: true,
    highlightAngles: true,
    annotateRulers: true,
  },
  architect: {
    lineColor: 'rgba(96, 165, 250, 0.5)',
    lineWidth: 1,
    labelColor: '#60a5fa',
    labelSize: 10,
    showCusps: true,
    showDegrees: true,
    showRulers: true,
    showInterceptedSigns: true,
    gridStyle: 'technical',
  },
  sovereign: {
    lineColor: 'rgba(251, 191, 36, 0.2)',
    lineWidth: 1,
    labelColor: '#a3a3a3',
    labelSize: 12,
    showCusps: false,
    highlightAngles: true,
    angleGlow: 'rgba(251, 191, 36, 0.6)',
    showKeyHousesOnly: [1, 4, 7, 10],
  },
};

// ============================================================================
// CHART LAYOUT CONFIGURATIONS
// ============================================================================

const CHART_LAYOUTS = {
  pilgrim: {
    name: 'Lantern & Mist',
    description: 'Soft, glowing chart with mythic atmosphere',
    wheelStyle: 'traditional',
    backgroundStyle: 'gradient_radial',
    backgroundColors: ['#1a1520', '#2a2030', '#1a1828'],
    showZodiacBand: true,
    zodiacBandStyle: 'illustrated',
    showStars: true,
    starDensity: 0.3,
    ambientGlow: true,
    animation: {
      wheelRotate: false,
      planetBreath: true,
      glowPulse: true,
    },
  },
  scholar: {
    name: 'Annotated Manuscript',
    description: 'Clean, readable chart with margin notes',
    wheelStyle: 'modern',
    backgroundStyle: 'solid',
    backgroundColor: '#1a1a20',
    showZodiacBand: true,
    zodiacBandStyle: 'minimal',
    showStars: false,
    marginNotes: true,
    marginNoteStyle: 'academic',
    gridLines: false,
    animation: {
      wheelRotate: false,
      planetBreath: false,
      highlightOnHover: true,
    },
  },
  architect: {
    name: 'Blueprint Grid',
    description: 'Technical chart with grid overlay and data readouts',
    wheelStyle: 'technical',
    backgroundStyle: 'grid',
    backgroundColor: '#0a0f1a',
    gridColor: 'rgba(96, 165, 250, 0.1)',
    gridSize: 20,
    showZodiacBand: true,
    zodiacBandStyle: 'degrees',
    showStars: false,
    dataReadouts: true,
    readoutPosition: 'corners',
    showCoordinates: true,
    animation: {
      wheelRotate: false,
      planetBreath: false,
      scanLine: true,
      dataFlicker: true,
    },
  },
  sovereign: {
    name: 'Obsidian Throne',
    description: 'Minimalist, commanding presence',
    wheelStyle: 'minimal',
    backgroundStyle: 'solid',
    backgroundColor: '#0a0a0f',
    showZodiacBand: false,
    showStars: false,
    emphasisRing: true,
    emphasisColor: 'rgba(251, 191, 36, 0.3)',
    showKeyPlanetsOnly: ['Sun', 'Moon', 'Mars', 'Saturn', 'Pluto'],
    animation: {
      wheelRotate: false,
      planetBreath: false,
      commandPulse: true,
    },
  },
};

// ============================================================================
// COMPLETE MODE THEMES
// ============================================================================

export const MODE_CHART_THEMES = {
  pilgrim: {
    name: 'Pilgrim Theme',
    description: 'Warm, mythic, contemplative',
    palette: PALETTES.warmGold,
    elements: ELEMENT_COLORS.pilgrim,
    planets: PLANET_STYLES.pilgrim,
    aspects: ASPECT_STYLES.pilgrim,
    houses: HOUSE_STYLES.pilgrim,
    layout: CHART_LAYOUTS.pilgrim,
  },
  scholar: {
    name: 'Scholar Theme',
    description: 'Clean, annotated, educational',
    palette: PALETTES.parchment,
    elements: ELEMENT_COLORS.scholar,
    planets: PLANET_STYLES.scholar,
    aspects: ASPECT_STYLES.scholar,
    houses: HOUSE_STYLES.scholar,
    layout: CHART_LAYOUTS.scholar,
  },
  architect: {
    name: 'Architect Theme',
    description: 'Technical, precise, data-rich',
    palette: PALETTES.blueprint,
    elements: ELEMENT_COLORS.architect,
    planets: PLANET_STYLES.architect,
    aspects: ASPECT_STYLES.architect,
    houses: HOUSE_STYLES.architect,
    layout: CHART_LAYOUTS.architect,
  },
  sovereign: {
    name: 'Sovereign Theme',
    description: 'Commanding, minimal, strategic',
    palette: PALETTES.obsidianGold,
    elements: ELEMENT_COLORS.sovereign,
    planets: PLANET_STYLES.sovereign,
    aspects: ASPECT_STYLES.sovereign,
    houses: HOUSE_STYLES.sovereign,
    layout: CHART_LAYOUTS.sovereign,
  },
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Get complete chart theme for a mode.
 */
export function getChartTheme(mode) {
  return MODE_CHART_THEMES[mode] || MODE_CHART_THEMES.pilgrim;
}

/**
 * Get color palette for a mode.
 */
export function getThemePalette(mode) {
  const theme = getChartTheme(mode);
  return theme.palette;
}

/**
 * Get element color for a mode.
 */
export function getElementColor(mode, element) {
  const theme = getChartTheme(mode);
  return theme.elements[element.toLowerCase()] || theme.elements.fire;
}

/**
 * Get aspect style for a mode.
 */
export function getAspectStyle(mode, aspectType) {
  const theme = getChartTheme(mode);
  return theme.aspects[aspectType.toLowerCase()] || theme.aspects.conjunction;
}

/**
 * Get planet style for a mode.
 */
export function getPlanetStyle(mode) {
  const theme = getChartTheme(mode);
  return theme.planets;
}

/**
 * Get house style for a mode.
 */
export function getHouseStyle(mode) {
  const theme = getChartTheme(mode);
  return theme.houses;
}

/**
 * Get chart layout configuration for a mode.
 */
export function getChartLayout(mode) {
  const theme = getChartTheme(mode);
  return theme.layout;
}

/**
 * Generate CSS variables for a mode theme.
 */
export function generateThemeCSSVariables(mode) {
  const theme = getChartTheme(mode);
  const { palette } = theme;

  return {
    '--chart-primary': palette.primary,
    '--chart-secondary': palette.secondary,
    '--chart-accent': palette.accent,
    '--chart-background': palette.background,
    '--chart-surface': palette.surface,
    '--chart-text': palette.text,
    '--chart-text-muted': palette.textMuted,
    '--chart-glow': palette.glow,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  PALETTES,
  ELEMENT_COLORS,
  PLANET_STYLES,
  ASPECT_STYLES,
  HOUSE_STYLES,
  CHART_LAYOUTS,
};

export default {
  MODE_CHART_THEMES,
  getChartTheme,
  getThemePalette,
  getElementColor,
  getAspectStyle,
  getPlanetStyle,
  getHouseStyle,
  getChartLayout,
  generateThemeCSSVariables,
};
