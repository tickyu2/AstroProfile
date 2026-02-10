/**
 * Wheel Mode Context
 *
 * Global state management for wheel mode:
 * - default: All layers visible, neutral emphasis
 * - seasons: Highlight the seasons ring
 * - modality: Highlight the modality ring
 * - elements: Highlight the elements ring
 * - signs: Highlight the signs ring
 */

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { WheelMode, LayerName, PlanetPosition, ALLOWED_TRANSITIONS } from '../types/wheelModes';

interface WheelModeContextValue {
  // Current mode
  mode: WheelMode;
  setMode: (mode: WheelMode) => void;

  // Mode transitions
  transitionTo: (mode: WheelMode) => boolean;
  canTransitionTo: (mode: WheelMode) => boolean;

  // Layer control
  enabledLayers: Set<LayerName>;
  toggleLayer: (layer: LayerName) => void;
  enableLayer: (layer: LayerName) => void;
  disableLayer: (layer: LayerName) => void;
  isLayerEnabled: (layer: LayerName) => boolean;

  // Active selection
  activeSign: string | null;
  setActiveSign: (sign: string | null) => void;
  activeDegree: number;
  setActiveDegree: (degree: number) => void;

  // Planet positions
  planetPositions: PlanetPosition[];
  setPlanetPositions: (positions: PlanetPosition[]) => void;

  // Convenience booleans
  isSeasonsMode: boolean;
  isModalityMode: boolean;
  isElementsMode: boolean;
  isSignsMode: boolean;
  isDefaultMode: boolean;
}

const WheelModeContext = createContext<WheelModeContextValue | null>(null);

const ALL_LAYERS: LayerName[] = [
  'months', 'retrograde', 'season', 'modality',
  'element', 'signs', 'decans', 'planets', 'center'
];

interface WheelModeProviderProps {
  children: ReactNode;
  defaultMode?: WheelMode;
  defaultSign?: string;
  defaultDegree?: number;
}

export function WheelModeProvider({
  children,
  defaultMode = 'default',
  defaultSign = null,
  defaultDegree = 0
}: WheelModeProviderProps) {
  const [mode, setModeInternal] = useState<WheelMode>(defaultMode);
  const [enabledLayers, setEnabledLayers] = useState<Set<LayerName>>(new Set(ALL_LAYERS));
  const [activeSign, setActiveSign] = useState<string | null>(defaultSign);
  const [activeDegree, setActiveDegree] = useState<number>(defaultDegree);
  const [planetPositions, setPlanetPositions] = useState<PlanetPosition[]>([]);

  const canTransitionTo = useCallback((targetMode: WheelMode): boolean => {
    return ALLOWED_TRANSITIONS[mode].includes(targetMode);
  }, [mode]);

  const transitionTo = useCallback((targetMode: WheelMode): boolean => {
    if (!canTransitionTo(targetMode)) {
      console.warn(`Cannot transition from ${mode} to ${targetMode}`);
      return false;
    }
    setModeInternal(targetMode);
    return true;
  }, [mode, canTransitionTo]);

  const setMode = useCallback((newMode: WheelMode) => {
    setModeInternal(newMode);
  }, []);

  const toggleLayer = useCallback((layer: LayerName) => {
    setEnabledLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  }, []);

  const enableLayer = useCallback((layer: LayerName) => {
    setEnabledLayers(prev => new Set([...prev, layer]));
  }, []);

  const disableLayer = useCallback((layer: LayerName) => {
    setEnabledLayers(prev => {
      const next = new Set(prev);
      next.delete(layer);
      return next;
    });
  }, []);

  const isLayerEnabled = useCallback((layer: LayerName): boolean => {
    return enabledLayers.has(layer);
  }, [enabledLayers]);

  const value = useMemo<WheelModeContextValue>(() => ({
    mode,
    setMode,
    transitionTo,
    canTransitionTo,
    enabledLayers,
    toggleLayer,
    enableLayer,
    disableLayer,
    isLayerEnabled,
    activeSign,
    setActiveSign,
    activeDegree,
    setActiveDegree,
    planetPositions,
    setPlanetPositions,
    isSeasonsMode: mode === 'seasons',
    isModalityMode: mode === 'modality',
    isElementsMode: mode === 'elements',
    isSignsMode: mode === 'signs',
    isDefaultMode: mode === 'default'
  }), [
    mode, setMode, transitionTo, canTransitionTo,
    enabledLayers, toggleLayer, enableLayer, disableLayer, isLayerEnabled,
    activeSign, activeDegree, planetPositions
  ]);

  return (
    <WheelModeContext.Provider value={value}>
      {children}
    </WheelModeContext.Provider>
  );
}

export function useWheelMode(): WheelModeContextValue {
  const context = useContext(WheelModeContext);
  if (!context) {
    throw new Error('useWheelMode must be used within a WheelModeProvider');
  }
  return context;
}

export default WheelModeContext;
