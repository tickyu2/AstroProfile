/**
 * Enhanced Season Rings Component
 *
 * D3 wheel visualization that responds to WheelModeContext:
 * - Mode-aware rendering
 * - Layer toggling
 * - Smooth transitions between modes
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useWheelMode } from '../contexts/WheelModeContext';
import { LayerManager } from '../managers/LayerManager';
import { RenderConfig } from '../types/wheelModes';
import './EnhancedSeasonRings.css';

interface EnhancedSeasonRingsProps {
  width?: number;
  height?: number;
  onSignClick?: (sign: string, degree: number) => void;
}

export const EnhancedSeasonRings: React.FC<EnhancedSeasonRingsProps> = ({
  width = 600,
  height = 600,
  onSignClick
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const layerManagerRef = useRef<LayerManager | null>(null);
  const prevModeRef = useRef<string | null>(null);

  const {
    mode,
    activeSign,
    activeDegree,
    planetPositions,
    enabledLayers,
    setActiveSign,
    setActiveDegree
  } = useWheelMode();

  // Initialize layer manager
  useEffect(() => {
    layerManagerRef.current = new LayerManager();
  }, []);

  // Sync enabled layers with LayerManager
  useEffect(() => {
    if (!layerManagerRef.current) return;

    const allLayers = ['months', 'retrograde', 'season', 'modality', 'element', 'signs', 'decans', 'planets', 'center'] as const;

    allLayers.forEach(layer => {
      if (enabledLayers.has(layer)) {
        layerManagerRef.current!.enableLayer(layer);
      } else {
        layerManagerRef.current!.disableLayer(layer);
      }
    });
  }, [enabledLayers]);

  // Render wheel
  useEffect(() => {
    if (!svgRef.current || !layerManagerRef.current) return;

    const svg = d3.select(svgRef.current);
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) / 2 - 50;

    const config: RenderConfig = {
      mode,
      activeSign: activeSign || undefined,
      activeDegree,
      planetPositions,
      centerX,
      centerY,
      baseRadius
    };

    // Check if we need a transition
    if (prevModeRef.current && prevModeRef.current !== mode) {
      layerManagerRef.current.transition(prevModeRef.current as any, mode, 600);
    }

    // Full render
    layerManagerRef.current.renderAll(svg as any, config);

    // Update previous mode
    prevModeRef.current = mode;

  }, [mode, activeSign, activeDegree, planetPositions, enabledLayers, width, height]);

  // Handle clicks on the wheel
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const centerX = width / 2;
    const centerY = height / 2;

    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    // Calculate angle from center
    let angle = Math.atan2(y, x) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;

    const degree = (angle * 180 / Math.PI) % 360;
    const signIndex = Math.floor(degree / 30);
    const degreeInSign = degree % 30;

    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                   'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const clickedSign = signs[signIndex];

    setActiveSign(clickedSign);
    setActiveDegree(degree);

    if (onSignClick) {
      onSignClick(clickedSign, degreeInSign);
    }
  };

  return (
    <div className="enhanced-season-rings">
      <svg
        ref={svgRef}
        className="enhanced-season-rings-svg"
        viewBox={`0 0 ${width} ${height}`}
        onClick={handleClick}
      />

      <div className="mode-indicator">
        <span className="mode-badge">{mode.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default EnhancedSeasonRings;
