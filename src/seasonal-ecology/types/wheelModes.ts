/**
 * Wheel Mode Type Definitions
 *
 * Five view modes - each highlights a specific ring:
 * - default: All layers visible, neutral emphasis
 * - seasons: Highlight the seasons ring
 * - modality: Highlight the modality ring
 * - elements: Highlight the elements ring
 * - signs: Highlight the signs ring
 */

import * as d3 from 'd3';

export type WheelMode = "default" | "seasons" | "modality" | "elements" | "signs";

export type LayerName =
  | "months"
  | "retrograde"
  | "season"
  | "modality"
  | "element"
  | "signs"
  | "decans"
  | "planets"
  | "center";

export interface LayerConfig {
  name: LayerName;
  enabled: boolean;
  zIndex: number;
  render: (g: d3.Selection<SVGGElement, unknown, null, undefined>, mode: WheelMode, config: RenderConfig) => void;
}

export interface RenderConfig {
  mode: WheelMode;
  activeSign?: string;
  activeDegree?: number;
  planetPositions?: PlanetPosition[];
  centerX: number;
  centerY: number;
  baseRadius: number;
}

export interface PlanetPosition {
  planet: string;
  degree: number; // Absolute 0-360
  sign: string;
  symbol: string;
  retrograde?: boolean;
}

export interface ModeTransition {
  from: WheelMode;
  to: WheelMode;
  duration: number;
  easing: string;
}

// Mode transition table - all modes can transition to any other mode
export const ALLOWED_TRANSITIONS: Record<WheelMode, WheelMode[]> = {
  default: ["seasons", "modality", "elements", "signs"],
  seasons: ["default", "modality", "elements", "signs"],
  modality: ["default", "seasons", "elements", "signs"],
  elements: ["default", "seasons", "modality", "signs"],
  signs: ["default", "seasons", "modality", "elements"]
};

// Visual parameters per mode
export interface ModeVisuals {
  seasonRingOpacity: number;
  modalityRingOpacity: number;
  elementRingOpacity: number;
  signOpacity: (sign: string) => number;
  radiusAdjustment: (layer: LayerName) => number;
}

export const MODE_VISUALS: Record<WheelMode, ModeVisuals> = {
  default: {
    seasonRingOpacity: 1,
    modalityRingOpacity: 1,
    elementRingOpacity: 1,
    signOpacity: () => 1,
    radiusAdjustment: () => 0
  },
  seasons: {
    seasonRingOpacity: 1,
    modalityRingOpacity: 0.35,
    elementRingOpacity: 0.35,
    signOpacity: () => 0.5,
    radiusAdjustment: (layer) => layer === "season" ? 10 : 0
  },
  modality: {
    seasonRingOpacity: 0.35,
    modalityRingOpacity: 1,
    elementRingOpacity: 0.35,
    signOpacity: () => 0.5,
    radiusAdjustment: (layer) => layer === "modality" ? 10 : 0
  },
  elements: {
    seasonRingOpacity: 0.35,
    modalityRingOpacity: 0.35,
    elementRingOpacity: 1,
    signOpacity: () => 0.5,
    radiusAdjustment: (layer) => layer === "element" ? 10 : 0
  },
  signs: {
    seasonRingOpacity: 0.35,
    modalityRingOpacity: 0.35,
    elementRingOpacity: 0.35,
    signOpacity: () => 1,
    radiusAdjustment: (layer) => layer === "signs" ? 5 : 0
  }
};
