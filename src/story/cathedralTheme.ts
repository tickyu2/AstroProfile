/**
 * ============================================================================
 * CATHEDRAL THEME SYSTEM (大教堂主题系统)
 * ============================================================================
 *
 * The ceremonial palette of your cathedral.
 * Light, dark, and ceremonial modes with sacred geometry.
 *
 * Three Modes:
 * - Light (Dawn) - Ivory parchment, gold accents
 * - Dark (Midnight) - Obsidian, moonlit silver
 * - Ceremonial (Ritual) - Crimson, gold leaf, black marble
 *
 * Created: January 2026
 * ============================================================================
 */

import type {
  ThemeMode,
  Element,
  EmotionalTone,
  BeatType,
  SpacingKey,
  FontSizeKey,
  ShadowKey,
  RadiusKey
} from './cathedralUiTypes';

import {
  ELEMENT_COLORS,
  EMOTIONAL_TONE_COLORS,
  BEAT_TYPE_COLORS,
  LIFECYCLE_PHASE_COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  RADII,
  BREAKPOINTS
} from './cathedralUiTypes';

// ============================================================================
// COLOR TOKENS
// ============================================================================

export interface ColorTokens {
  // Backgrounds
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };

  // Foregrounds
  foreground: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };

  // Borders
  border: {
    default: string;
    subtle: string;
    strong: string;
    focus: string;
  };

  // Accents
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };

  // Semantic
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  // Special
  special: {
    gold: string;
    silver: string;
    bronze: string;
    ceremonial: string;
  };
}

// ============================================================================
// THEME PALETTES
// ============================================================================

const lightPalette: ColorTokens = {
  background: {
    primary: '#fdfbf7',      // Ivory parchment
    secondary: '#f5f0e6',    // Warm off-white
    tertiary: '#ebe5d9',     // Aged paper
    elevated: '#ffffff',     // Pure white
    overlay: 'rgba(30, 27, 75, 0.5)'
  },
  foreground: {
    primary: '#1e1b4b',      // Deep indigo
    secondary: '#3730a3',    // Indigo
    tertiary: '#6366f1',     // Light indigo
    muted: '#8b7355',        // Sepia
    inverse: '#fdfbf7'
  },
  border: {
    default: '#d4c9b8',      // Warm gray
    subtle: '#e8e0d3',       // Light warm gray
    strong: '#a89a86',       // Dark warm gray
    focus: '#d4af37'         // Gold
  },
  accent: {
    primary: '#d4af37',      // Gold
    secondary: '#1e1b4b',    // Deep indigo
    tertiary: '#8b5cf6'      // Violet
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  special: {
    gold: '#d4af37',
    silver: '#94a3b8',
    bronze: '#cd7f32',
    ceremonial: '#8b0000'
  }
};

const darkPalette: ColorTokens = {
  background: {
    primary: '#0f0f1a',      // Obsidian
    secondary: '#1a1a2e',    // Dark navy
    tertiary: '#252540',     // Muted navy
    elevated: '#2a2a4a',     // Elevated navy
    overlay: 'rgba(0, 0, 0, 0.7)'
  },
  foreground: {
    primary: '#e2e8f0',      // Moonlit silver
    secondary: '#94a3b8',    // Muted silver
    tertiary: '#64748b',     // Dim silver
    muted: '#475569',        // Dark silver
    inverse: '#0f0f1a'
  },
  border: {
    default: '#334155',      // Slate
    subtle: '#1e293b',       // Dark slate
    strong: '#475569',       // Light slate
    focus: '#3b82f6'         // Blue
  },
  accent: {
    primary: '#3b82f6',      // Blue
    secondary: '#8b5cf6',    // Violet
    tertiary: '#06b6d4'      // Cyan
  },
  semantic: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  special: {
    gold: '#fbbf24',
    silver: '#e2e8f0',
    bronze: '#f59e0b',
    ceremonial: '#dc2626'
  }
};

const ceremonialPalette: ColorTokens = {
  background: {
    primary: '#1a0a0a',      // Black marble
    secondary: '#2d1b1b',    // Deep crimson black
    tertiary: '#3d2222',     // Warm black
    elevated: '#4a2828',     // Elevated crimson
    overlay: 'rgba(0, 0, 0, 0.8)'
  },
  foreground: {
    primary: '#fef3c7',      // Warm gold
    secondary: '#d4af37',    // Gold
    tertiary: '#fbbf24',     // Bright gold
    muted: '#92400e',        // Dark amber
    inverse: '#1a0a0a'
  },
  border: {
    default: '#5c3333',      // Dark crimson
    subtle: '#3d2222',       // Very dark crimson
    strong: '#d4af37',       // Gold
    focus: '#fbbf24'         // Bright gold
  },
  accent: {
    primary: '#d4af37',      // Gold
    secondary: '#dc2626',    // Crimson
    tertiary: '#fbbf24'      // Bright gold
  },
  semantic: {
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#dc2626',
    info: '#d4af37'
  },
  special: {
    gold: '#d4af37',
    silver: '#94a3b8',
    bronze: '#cd7f32',
    ceremonial: '#dc2626'
  }
};

// ============================================================================
// COMPLETE THEME
// ============================================================================

export interface CathedralTheme {
  mode: ThemeMode;
  colors: ColorTokens;
  elements: typeof ELEMENT_COLORS;
  emotions: typeof EMOTIONAL_TONE_COLORS;
  beats: typeof BEAT_TYPE_COLORS;
  phases: typeof LIFECYCLE_PHASE_COLORS;
  spacing: typeof SPACING;
  fontSizes: typeof FONT_SIZES;
  fontWeights: typeof FONT_WEIGHTS;
  shadows: typeof SHADOWS;
  radii: typeof RADII;
  breakpoints: typeof BREAKPOINTS;
  transitions: TransitionTokens;
  typography: TypographyTokens;
}

export interface TransitionTokens {
  fast: string;
  normal: string;
  slow: string;
  ceremonial: string;
}

export interface TypographyTokens {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
    chinese: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

const transitions: TransitionTokens = {
  fast: '150ms ease',
  normal: '300ms ease',
  slow: '500ms ease',
  ceremonial: '800ms cubic-bezier(0.4, 0, 0.2, 1)'
};

const typography: TypographyTokens = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    chinese: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em'
  }
};

// ============================================================================
// THEME FACTORY
// ============================================================================

/**
 * Create a complete theme for a given mode
 */
export function createTheme(mode: ThemeMode): CathedralTheme {
  const palette = mode === 'light'
    ? lightPalette
    : mode === 'dark'
      ? darkPalette
      : ceremonialPalette;

  return {
    mode,
    colors: palette,
    elements: ELEMENT_COLORS,
    emotions: EMOTIONAL_TONE_COLORS,
    beats: BEAT_TYPE_COLORS,
    phases: LIFECYCLE_PHASE_COLORS,
    spacing: SPACING,
    fontSizes: FONT_SIZES,
    fontWeights: FONT_WEIGHTS,
    shadows: SHADOWS,
    radii: RADII,
    breakpoints: BREAKPOINTS,
    transitions,
    typography
  };
}

/**
 * Pre-built themes
 */
export const themes: Record<ThemeMode, CathedralTheme> = {
  light: createTheme('light'),
  dark: createTheme('dark'),
  ceremonial: createTheme('ceremonial')
};

/**
 * Default theme
 */
export const defaultTheme = themes.light;

// ============================================================================
// CSS VARIABLE GENERATOR
// ============================================================================

/**
 * Generate CSS custom properties from theme
 */
export function generateCssVariables(theme: CathedralTheme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Background colors
  vars['--bg-primary'] = theme.colors.background.primary;
  vars['--bg-secondary'] = theme.colors.background.secondary;
  vars['--bg-tertiary'] = theme.colors.background.tertiary;
  vars['--bg-elevated'] = theme.colors.background.elevated;
  vars['--bg-overlay'] = theme.colors.background.overlay;

  // Foreground colors
  vars['--fg-primary'] = theme.colors.foreground.primary;
  vars['--fg-secondary'] = theme.colors.foreground.secondary;
  vars['--fg-tertiary'] = theme.colors.foreground.tertiary;
  vars['--fg-muted'] = theme.colors.foreground.muted;
  vars['--fg-inverse'] = theme.colors.foreground.inverse;

  // Border colors
  vars['--border-default'] = theme.colors.border.default;
  vars['--border-subtle'] = theme.colors.border.subtle;
  vars['--border-strong'] = theme.colors.border.strong;
  vars['--border-focus'] = theme.colors.border.focus;

  // Accent colors
  vars['--accent-primary'] = theme.colors.accent.primary;
  vars['--accent-secondary'] = theme.colors.accent.secondary;
  vars['--accent-tertiary'] = theme.colors.accent.tertiary;

  // Semantic colors
  vars['--success'] = theme.colors.semantic.success;
  vars['--warning'] = theme.colors.semantic.warning;
  vars['--error'] = theme.colors.semantic.error;
  vars['--info'] = theme.colors.semantic.info;

  // Special colors
  vars['--gold'] = theme.colors.special.gold;
  vars['--silver'] = theme.colors.special.silver;
  vars['--bronze'] = theme.colors.special.bronze;
  vars['--ceremonial'] = theme.colors.special.ceremonial;

  // Element colors
  for (const [element, colors] of Object.entries(theme.elements)) {
    vars[`--element-${element.toLowerCase()}`] = colors.primary;
    vars[`--element-${element.toLowerCase()}-light`] = colors.light;
    vars[`--element-${element.toLowerCase()}-dark`] = colors.dark;
  }

  // Spacing
  for (const [key, value] of Object.entries(theme.spacing)) {
    vars[`--space-${key}`] = value;
  }

  // Font sizes
  for (const [key, value] of Object.entries(theme.fontSizes)) {
    vars[`--text-${key}`] = value;
  }

  // Shadows
  for (const [key, value] of Object.entries(theme.shadows)) {
    vars[`--shadow-${key}`] = value;
  }

  // Radii
  for (const [key, value] of Object.entries(theme.radii)) {
    vars[`--radius-${key}`] = value;
  }

  // Transitions
  vars['--transition-fast'] = theme.transitions.fast;
  vars['--transition-normal'] = theme.transitions.normal;
  vars['--transition-slow'] = theme.transitions.slow;
  vars['--transition-ceremonial'] = theme.transitions.ceremonial;

  // Typography
  vars['--font-sans'] = theme.typography.fontFamily.sans;
  vars['--font-serif'] = theme.typography.fontFamily.serif;
  vars['--font-mono'] = theme.typography.fontFamily.mono;
  vars['--font-chinese'] = theme.typography.fontFamily.chinese;

  return vars;
}

/**
 * Generate CSS string from variables
 */
export function generateCssString(theme: CathedralTheme): string {
  const vars = generateCssVariables(theme);
  const lines = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get element color for a given element
 */
export function getElementColor(element: Element, variant: 'primary' | 'light' | 'dark' = 'primary'): string {
  return ELEMENT_COLORS[element][variant];
}

/**
 * Get emotional tone color
 */
export function getEmotionalColor(tone: EmotionalTone): string {
  return EMOTIONAL_TONE_COLORS[tone].primary;
}

/**
 * Get beat type color
 */
export function getBeatColor(beatType: BeatType): string {
  return BEAT_TYPE_COLORS[beatType].primary;
}

/**
 * Get spacing value
 */
export function getSpacing(key: SpacingKey): string {
  return SPACING[key];
}

/**
 * Get font size
 */
export function getFontSize(key: FontSizeKey): string {
  return FONT_SIZES[key];
}

/**
 * Get shadow
 */
export function getShadow(key: ShadowKey): string {
  return SHADOWS[key];
}

/**
 * Get radius
 */
export function getRadius(key: RadiusKey): string {
  return RADII[key];
}

/**
 * Calculate score tier
 */
export function getScoreTier(score: number): 'excellent' | 'good' | 'neutral' | 'challenging' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'neutral';
  return 'challenging';
}

/**
 * Get tier color
 */
export function getTierColor(tier: 'excellent' | 'good' | 'neutral' | 'challenging', theme: CathedralTheme): string {
  switch (tier) {
    case 'excellent':
      return theme.colors.semantic.success;
    case 'good':
      return theme.colors.semantic.info;
    case 'neutral':
      return theme.colors.semantic.warning;
    case 'challenging':
      return theme.colors.semantic.error;
  }
}

/**
 * Get ritual tier color
 */
export function getRitualTierColor(tier: 'golden' | 'silver' | 'bronze', theme: CathedralTheme): string {
  return theme.colors.special[tier];
}

// ============================================================================
// SACRED GEOMETRY HELPERS
// ============================================================================

/**
 * Golden ratio constant
 */
export const GOLDEN_RATIO = 1.618033988749895;

/**
 * Calculate golden ratio dimension
 */
export function goldenRatio(base: number, larger: boolean = true): number {
  return larger ? base * GOLDEN_RATIO : base / GOLDEN_RATIO;
}

/**
 * Generate Fibonacci sequence
 */
export function fibonacci(n: number): number[] {
  const sequence = [1, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence.slice(0, n);
}

/**
 * Calculate angle for radial layout
 */
export function radialAngle(index: number, total: number, startAngle: number = 0): number {
  return startAngle + (360 / total) * index;
}

/**
 * Calculate position on circle
 */
export function circlePosition(
  angle: number,
  radius: number,
  centerX: number = 0,
  centerY: number = 0
): { x: number; y: number } {
  const radians = (angle - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(radians),
    y: centerY + radius * Math.sin(radians)
  };
}

/**
 * Generate mandala positions
 */
export function mandalaPositions(
  layers: number[],
  centerX: number = 0,
  centerY: number = 0
): Array<{ x: number; y: number; layer: number; index: number }> {
  const positions: Array<{ x: number; y: number; layer: number; index: number }> = [];

  layers.forEach((itemsInLayer, layerIndex) => {
    const radius = (layerIndex + 1) * 50; // Base radius of 50 per layer

    for (let i = 0; i < itemsInLayer; i++) {
      const angle = radialAngle(i, itemsInLayer);
      const pos = circlePosition(angle, radius, centerX, centerY);
      positions.push({
        ...pos,
        layer: layerIndex,
        index: i
      });
    }
  });

  return positions;
}

// ============================================================================
// COMPONENT STYLE GENERATORS
// ============================================================================

/**
 * Generate card styles
 */
export function cardStyles(theme: CathedralTheme, variant: 'default' | 'elevated' | 'outlined' = 'default'): Record<string, string> {
  const base = {
    backgroundColor: theme.colors.background.elevated,
    color: theme.colors.foreground.primary,
    borderRadius: theme.radii.lg,
    padding: theme.spacing[4],
    transition: theme.transitions.normal
  };

  switch (variant) {
    case 'elevated':
      return {
        ...base,
        boxShadow: theme.shadows.lg
      };
    case 'outlined':
      return {
        ...base,
        backgroundColor: 'transparent',
        border: `1px solid ${theme.colors.border.default}`
      };
    default:
      return {
        ...base,
        boxShadow: theme.shadows.base
      };
  }
}

/**
 * Generate button styles
 */
export function buttonStyles(
  theme: CathedralTheme,
  variant: 'primary' | 'secondary' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): Record<string, string> {
  const sizes = {
    sm: { padding: `${theme.spacing[1]} ${theme.spacing[3]}`, fontSize: theme.fontSizes.sm },
    md: { padding: `${theme.spacing[2]} ${theme.spacing[4]}`, fontSize: theme.fontSizes.base },
    lg: { padding: `${theme.spacing[3]} ${theme.spacing[6]}`, fontSize: theme.fontSizes.lg }
  };

  const base = {
    ...sizes[size],
    borderRadius: theme.radii.md,
    fontWeight: String(theme.fontWeights.medium),
    transition: theme.transitions.fast,
    cursor: 'pointer',
    border: 'none'
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        backgroundColor: theme.colors.accent.primary,
        color: theme.mode === 'light' ? theme.colors.foreground.inverse : theme.colors.foreground.primary
      };
    case 'secondary':
      return {
        ...base,
        backgroundColor: theme.colors.background.tertiary,
        color: theme.colors.foreground.primary
      };
    case 'ghost':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: theme.colors.foreground.secondary
      };
  }
}

/**
 * Generate badge styles
 */
export function badgeStyles(
  theme: CathedralTheme,
  color: string,
  size: 'sm' | 'md' | 'lg' = 'md'
): Record<string, string> {
  const sizes = {
    sm: { padding: `${theme.spacing[0]} ${theme.spacing[2]}`, fontSize: theme.fontSizes.xs },
    md: { padding: `${theme.spacing[1]} ${theme.spacing[3]}`, fontSize: theme.fontSizes.sm },
    lg: { padding: `${theme.spacing[2]} ${theme.spacing[4]}`, fontSize: theme.fontSizes.base }
  };

  return {
    ...sizes[size],
    backgroundColor: `${color}20`, // 20% opacity
    color: color,
    borderRadius: theme.radii.full,
    fontWeight: String(theme.fontWeights.medium),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  lightPalette,
  darkPalette,
  ceremonialPalette,
  transitions,
  typography
};

