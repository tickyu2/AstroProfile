/**
 * useWheelLayers Hook
 * Visual storytelling layers for the Zodiac Wheel
 * Provides element glows, modality patterns, cusp gradients, and φ-curve animations
 */

import { useMemo } from 'react';
import { PureSignArchetype } from '../data/pureSignArchetypes';

// ============================================================================
// Types
// ============================================================================

export interface ElementGlow {
  color: string;
  gradient: string;
  shadowColor: string;
  haloOpacity: number;
}

export interface ModalityPattern {
  type: 'segmented' | 'solid' | 'dotted';
  strokeDasharray: string;
  strokeWidth: number;
  description: string;
}

export interface CuspGradient {
  fromColor: string;
  toColor: string;
  cssGradient: string;
  svgGradientId: string;
}

export interface PhiBar {
  percentage: number;
  fillWidth: string;
  label: string;
  cssTransform: string;
}

export interface WheelLayers {
  elementGlow: ElementGlow;
  modalityPattern: ModalityPattern;
  cuspGradient: CuspGradient | null;
  phiBar: PhiBar | null;
  tooltip: string;
}

export interface WheelLayersInput {
  sign?: PureSignArchetype;
  fromSign?: PureSignArchetype;
  toSign?: PureSignArchetype;
  dayBlend?: number; // 0-1, how much of the new sign
  day?: number; // 1-6
}

// ============================================================================
// Element Glow Styles
// ============================================================================

const ELEMENT_GLOWS: Record<string, ElementGlow> = {
  Fire: {
    color: '#ef4444',
    gradient: 'radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%)',
    shadowColor: 'rgba(239, 68, 68, 0.5)',
    haloOpacity: 0.6
  },
  Earth: {
    color: '#22c55e',
    gradient: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0) 70%)',
    shadowColor: 'rgba(34, 197, 94, 0.5)',
    haloOpacity: 0.5
  },
  Air: {
    color: '#38bdf8',
    gradient: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, rgba(56, 189, 248, 0) 70%)',
    shadowColor: 'rgba(56, 189, 248, 0.5)',
    haloOpacity: 0.5
  },
  Water: {
    color: '#8b5cf6',
    gradient: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(139, 92, 246, 0) 70%)',
    shadowColor: 'rgba(139, 92, 246, 0.5)',
    haloOpacity: 0.6
  }
};

/**
 * Get element glow styling
 */
export function getElementGlow(element: string): ElementGlow {
  return ELEMENT_GLOWS[element] || ELEMENT_GLOWS.Fire;
}

// ============================================================================
// Modality Patterns
// ============================================================================

const MODALITY_PATTERNS: Record<string, ModalityPattern> = {
  Cardinal: {
    type: 'segmented',
    strokeDasharray: '10 5',
    strokeWidth: 3,
    description: 'Segmented arrows — initiating energy'
  },
  Fixed: {
    type: 'solid',
    strokeDasharray: 'none',
    strokeWidth: 4,
    description: 'Solid band — stabilizing energy'
  },
  Mutable: {
    type: 'dotted',
    strokeDasharray: '3 3',
    strokeWidth: 2,
    description: 'Dotted band — transitional energy'
  }
};

/**
 * Get modality pattern styling
 */
export function getModalityPattern(modality: string): ModalityPattern {
  return MODALITY_PATTERNS[modality] || MODALITY_PATTERNS.Cardinal;
}

// ============================================================================
// Cusp Gradient
// ============================================================================

/**
 * Get cusp gradient between two signs
 */
export function getCuspGradient(
  fromSign: PureSignArchetype | undefined,
  toSign: PureSignArchetype | undefined,
  blend?: number
): CuspGradient | null {
  if (!fromSign || !toSign) return null;

  const fromGlow = getElementGlow(fromSign.element);
  const toGlow = getElementGlow(toSign.element);

  // Calculate gradient stop based on blend
  const blendPercent = blend ? Math.round(blend * 100) : 50;

  return {
    fromColor: fromGlow.color,
    toColor: toGlow.color,
    cssGradient: `linear-gradient(90deg, ${fromGlow.color} 0%, ${toGlow.color} ${blendPercent}%, ${toGlow.color} 100%)`,
    svgGradientId: `cusp-gradient-${fromSign.sign.toLowerCase()}-${toSign.sign.toLowerCase()}`
  };
}

// ============================================================================
// φ-Curve Bar
// ============================================================================

const PHI_CURVE_VALUES = [0.13, 0.37, 0.58, 0.75, 0.89, 0.98];

/**
 * Get φ-curve bar for visualization
 */
export function getPhiBar(dayBlend: number | undefined, day?: number): PhiBar | null {
  if (dayBlend === undefined && day === undefined) return null;

  // Use direct blend value or calculate from day
  const percentage = dayBlend !== undefined
    ? dayBlend
    : (day !== undefined && day >= 1 && day <= 6)
      ? PHI_CURVE_VALUES[day - 1]
      : 0.5;

  const percent = Math.round(percentage * 100);

  return {
    percentage,
    fillWidth: `${percent}%`,
    label: `${percent}% new sign`,
    cssTransform: `scaleX(${percentage})`
  };
}

// ============================================================================
// Tooltip Generator
// ============================================================================

/**
 * Generate tooltip text for wheel segment
 */
export function generateTooltip(
  sign?: PureSignArchetype,
  cuspInfo?: { fromSign: string; toSign: string; day: number; mythicName: string }
): string {
  if (cuspInfo) {
    const blendPercent = Math.round(PHI_CURVE_VALUES[cuspInfo.day - 1] * 100);
    return `${cuspInfo.mythicName} — ${100 - blendPercent}% ${cuspInfo.fromSign} / ${blendPercent}% ${cuspInfo.toSign}`;
  }

  if (sign) {
    return `${sign.symbol} ${sign.sign} — ${sign.mythicName}`;
  }

  return '';
}

// ============================================================================
// Blended Element Glow (for cusps)
// ============================================================================

/**
 * Blend two element glows based on φ-curve position
 */
export function blendElementGlows(
  fromElement: string,
  toElement: string,
  blend: number
): ElementGlow {
  const from = getElementGlow(fromElement);
  const to = getElementGlow(toElement);

  // Simple color interpolation (for demonstration - could use color library)
  const interpolateChannel = (c1: number, c2: number) =>
    Math.round(c1 * (1 - blend) + c2 * blend);

  // Parse hex colors
  const parseHex = (hex: string) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16)
  });

  const fromRgb = parseHex(from.color);
  const toRgb = parseHex(to.color);

  const blendedRgb = {
    r: interpolateChannel(fromRgb.r, toRgb.r),
    g: interpolateChannel(fromRgb.g, toRgb.g),
    b: interpolateChannel(fromRgb.b, toRgb.b)
  };

  const blendedHex = `#${blendedRgb.r.toString(16).padStart(2, '0')}${blendedRgb.g.toString(16).padStart(2, '0')}${blendedRgb.b.toString(16).padStart(2, '0')}`;

  return {
    color: blendedHex,
    gradient: `radial-gradient(circle, rgba(${blendedRgb.r}, ${blendedRgb.g}, ${blendedRgb.b}, 0.4) 0%, rgba(${blendedRgb.r}, ${blendedRgb.g}, ${blendedRgb.b}, 0) 70%)`,
    shadowColor: `rgba(${blendedRgb.r}, ${blendedRgb.g}, ${blendedRgb.b}, 0.5)`,
    haloOpacity: from.haloOpacity * (1 - blend) + to.haloOpacity * blend
  };
}

// ============================================================================
// Main Hook
// ============================================================================

/**
 * useWheelLayers - Compute all visual layers for a wheel segment
 */
export function useWheelLayers(input: WheelLayersInput): WheelLayers {
  return useMemo(() => {
    const { sign, fromSign, toSign, dayBlend, day } = input;

    // For pure signs
    if (sign && !fromSign && !toSign) {
      return {
        elementGlow: getElementGlow(sign.element),
        modalityPattern: getModalityPattern(sign.modality),
        cuspGradient: null,
        phiBar: null,
        tooltip: generateTooltip(sign)
      };
    }

    // For cusp transitions
    if (fromSign && toSign) {
      const blend = dayBlend ?? (day ? PHI_CURVE_VALUES[day - 1] : 0.5);

      return {
        elementGlow: blendElementGlows(fromSign.element, toSign.element, blend),
        modalityPattern: blend < 0.5
          ? getModalityPattern(fromSign.modality)
          : getModalityPattern(toSign.modality),
        cuspGradient: getCuspGradient(fromSign, toSign, blend),
        phiBar: getPhiBar(blend, day),
        tooltip: generateTooltip(undefined, {
          fromSign: fromSign.sign,
          toSign: toSign.sign,
          day: day || 3,
          mythicName: `${fromSign.symbol}${toSign.symbol} Cusp`
        })
      };
    }

    // Default
    return {
      elementGlow: ELEMENT_GLOWS.Fire,
      modalityPattern: MODALITY_PATTERNS.Cardinal,
      cuspGradient: null,
      phiBar: null,
      tooltip: ''
    };
  }, [input.sign, input.fromSign, input.toSign, input.dayBlend, input.day]);
}

// ============================================================================
// D3/SVG Helper Functions
// ============================================================================

/**
 * Generate SVG gradient definition for a cusp
 */
export function generateSvgGradientDef(gradient: CuspGradient): string {
  return `
    <linearGradient id="${gradient.svgGradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${gradient.fromColor}" />
      <stop offset="100%" stop-color="${gradient.toColor}" />
    </linearGradient>
  `;
}

/**
 * Generate SVG filter for element glow
 */
export function generateSvgGlowFilter(glow: ElementGlow, filterId: string): string {
  return `
    <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="${glow.shadowColor}" />
    </filter>
  `;
}

export default useWheelLayers;
