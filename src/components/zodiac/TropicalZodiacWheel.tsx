/**
 * TropicalZodiacWheel.tsx
 *
 * D3-based zodiac wheel visualization component.
 * Renders concentric rings: Signs, Elements, Modalities, Seasons
 * with interactive hover/click handlers and animated pulse effects.
 *
 * Extracted from TropicalSeasonsPage.tsx for better modularity.
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  SIGN_METADATA,
  ASPECT_DEFINITIONS,
  ZodiacSign,
  Season,
  D3SeasonArc,
  D3SignArc,
  AspectType,
} from '../../data/tropicalSeasons';
import {
  SIGN_TOOLTIPS,
  ELEMENT_TOOLTIPS,
  MODALITY_TOOLTIPS,
  CELESTIAL_EVENTS,
  SEASON_PULSE_COLORS,
  ASPECT_TOOLTIPS,
  type AspectKey,
} from '../../data/tropicalConstants';
import { useWheelMode } from '../../seasonal-ecology';

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = 'overview' | 'sign' | 'season' | 'compatibility';

// Type for sign arc data used in D3 callbacks
type SignArcData = D3SignArc;

export interface TropicalZodiacWheelProps {
  /** SVG dimensions */
  dimensions: { width: number; height: number };
  /** Pre-computed season arc data */
  seasonArcs: D3SeasonArc[];
  /** Pre-computed sign arc data */
  signArcs: D3SignArc[];
  /** Current view mode */
  viewMode: ViewMode;
  /** Currently selected sign (for panel display) */
  selectedSign: ZodiacSign | null;
  /** Sign A for compatibility comparison */
  signA: ZodiacSign | null;
  /** Sign B for compatibility comparison */
  signB: ZodiacSign | null;
  /** Currently selected aspect type */
  selectedAspect: AspectType | null;
  /** Set of signs highlighted by aspect selection */
  aspectHighlightedSigns: Set<ZodiacSign>;
  /** Reference sign for aspect calculation */
  aspectReferenceSign: ZodiacSign | null;
  /** Set of signs highlighted by element selection (educational) */
  elementHighlightedSigns?: Set<ZodiacSign>;
  /** Specific element to highlight in the elements ring (Fire, Earth, Air, Water) */
  highlightedElement?: string | null;
  /** Set of signs highlighted by modality selection (educational) */
  modalityHighlightedSigns?: Set<ZodiacSign>;
  /** Specific modality to highlight in the modality ring (Cardinal, Fixed, Mutable) */
  highlightedModality?: string | null;
  /** Currently selected season for highlighting (Spring, Summer, Autumn, Winter) */
  selectedSeason?: Season | null;

  // Callbacks
  /** Called when a sign is clicked */
  onSignClick: (sign: ZodiacSign) => void;
  /** Called when a season is clicked */
  onSeasonClick: (season: Season) => void;
  /** Called when hovering over a sign (null = mouseout) */
  onHoverSign: (sign: string | null) => void;
  /** Called when hovering over an element ring segment */
  onHoverElement: (element: string | null) => void;
  /** Called when hovering over a modality ring segment */
  onHoverModality: (modality: string | null) => void;
  /** Called when hovering over a celestial event marker */
  onHoverCelestialEvent: (id: string | null) => void;
  /** Called when hovering over an aspect symbol in the center */
  onHoverAspect?: (aspectKey: AspectKey | null) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const TropicalZodiacWheel: React.FC<TropicalZodiacWheelProps> = ({
  dimensions,
  seasonArcs,
  signArcs,
  viewMode,
  selectedSign,
  signA,
  signB,
  selectedAspect,
  aspectHighlightedSigns,
  aspectReferenceSign,
  elementHighlightedSigns,
  highlightedElement,
  modalityHighlightedSigns,
  highlightedModality,
  selectedSeason,
  onSignClick,
  onSeasonClick,
  onHoverSign,
  onHoverElement,
  onHoverModality,
  onHoverCelestialEvent,
  onHoverAspect,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // BATCH 5: Mode-aware rendering
  // Try to get wheel mode, fallback to 'default' if not in provider
  let wheelMode = 'default';
  try {
    const modeContext = useWheelMode();
    wheelMode = modeContext.mode;
  } catch {
    // Not wrapped in WheelModeProvider, use default
  }

  // Opacity helper based on current mode
  // Each mode highlights its corresponding ring, dims others
  const getModeOpacity = (layer: 'seasons' | 'modality' | 'element' | 'signs' | 'center'): number => {
    const DIM = 0.35;
    const FULL = 1;

    switch (wheelMode) {
      case 'seasons':
        return layer === 'seasons' ? FULL : DIM;
      case 'modality':
        return layer === 'modality' ? FULL : DIM;
      case 'elements':
        return layer === 'element' ? FULL : DIM;
      case 'signs':
        return layer === 'signs' ? FULL : DIM;
      default:
        // Default mode: all layers visible
        return FULL;
    }
  };

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Add mouseleave handler to clear all hover states when cursor exits SVG
    svg.on('mouseleave', function() {
      onHoverSign(null);
      onHoverElement(null);
      onHoverModality(null);
      onHoverCelestialEvent(null);
      if (onHoverAspect) {
        onHoverAspect(null);
      }
    });

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // NEW LAYOUT: Larger visualization with external labels
    const totalRadius = Math.min(width, height) / 2 - 25; // Reduced margin for larger circle

    // Center hub (25% larger again: 0.1875 * 1.25 = 0.234375)
    const centerRadius = totalRadius * 0.234375;

    // Sign ring (main feature)
    const signInnerRadius = centerRadius + 5;
    const signOuterRadius = totalRadius * 0.64;

    // Element ring (FIRE, EARTH, AIR, WATER)
    const elementInnerRadius = signOuterRadius + 2;
    const elementOuterRadius = totalRadius * 0.72;

    // Modality ring (Cardinal, Fixed, Mutable)
    const modalityInnerRadius = elementOuterRadius + 2;
    const modalityOuterRadius = totalRadius * 0.80;

    // Season ring (outer)
    const seasonInnerRadius = modalityOuterRadius + 2;
    const seasonOuterRadius = totalRadius * 0.92;

    // Main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Add invisible background to capture mouse leave from the entire visualization
    g.append('rect')
      .attr('x', -centerX)
      .attr('y', -centerY)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all')
      .on('mouseover', function() {
        // Clear aspect tooltip when mouse enters the background (not over aspect symbols)
        if (onHoverAspect) {
          onHoverAspect(null);
        }
      });

    // Helper to check if sign is selected for compatibility
    const isSignSelected = (sign: ZodiacSign) =>
      signA === sign || signB === sign;

    const getSignSelectionLabel = (sign: ZodiacSign): string | null => {
      if (signA === sign) return 'A';
      if (signB === sign) return 'B';
      return null;
    };

    // Draw center hub (no text - just a filled circle)
    g.append('circle')
      .attr('r', centerRadius)
      .attr('fill', 'rgba(15, 23, 42, 0.95)')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 2)
      .style('pointer-events', 'all')
      .on('mouseover', function() {
        // Clear aspect tooltip when hovering over the center hub area (not the symbols)
        if (onHoverAspect) {
          onHoverAspect(null);
        }
      });

    // Draw aspect symbols in the center hub
    const aspectGroup = g.append('g').attr('class', 'aspect-symbols');
    const aspectKeys: AspectKey[] = ['conjunction', 'semi-sextile', 'sextile', 'square', 'trine', 'quincunx', 'opposition'];
    const aspectSymbolRadius = centerRadius * 0.65; // Place symbols at 65% of center radius

    aspectKeys.forEach((aspectKey, index) => {
      const aspectData = ASPECT_TOOLTIPS[aspectKey];
      // Arrange in a circle, starting from top
      const angle = (index / aspectKeys.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * aspectSymbolRadius;
      const y = Math.sin(angle) * aspectSymbolRadius;

      // Determine if this aspect is currently selected
      const isSelected = selectedAspect === aspectKey;

      // Background circle for hit area
      aspectGroup.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 14)
        .attr('fill', isSelected ? `${aspectData.color}33` : 'transparent')
        .attr('stroke', isSelected ? aspectData.color : 'transparent')
        .attr('stroke-width', 2)
        .attr('class', `aspect-hit-area aspect-${aspectKey}`)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('fill', `${aspectData.color}44`)
            .attr('stroke', aspectData.color);
          if (onHoverAspect) {
            onHoverAspect(aspectKey);
          }
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('fill', isSelected ? `${aspectData.color}33` : 'transparent')
            .attr('stroke', isSelected ? aspectData.color : 'transparent');
          if (onHoverAspect) {
            onHoverAspect(null);
          }
        });

      // Aspect symbol text
      aspectGroup.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '16px')
        .style('fill', isSelected ? aspectData.color : 'rgba(255, 255, 255, 0.7)')
        .style('font-weight', isSelected ? '700' : '400')
        .style('pointer-events', 'none')
        .style('text-shadow', isSelected ? `0 0 8px ${aspectData.color}` : 'none')
        .text(aspectData.symbol);

      // Degree label below symbol
      aspectGroup.append('text')
        .attr('x', x)
        .attr('y', y + 12)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '7px')
        .style('fill', isSelected ? aspectData.color : 'rgba(255, 255, 255, 0.5)')
        .style('font-weight', '500')
        .style('pointer-events', 'none')
        .text(`${aspectData.degrees}°`);
    });

    // Draw 12 bicycle spokes from inner edge of sign segment to center (0,0)
    const spokesGroup = g.append('g').attr('class', 'spokes');

    // Helper to determine spoke styling
    const getSpokeStyle = (sign: ZodiacSign) => {
      const isCompatSelected = isSignSelected(sign);
      const isAspectHighlighted = aspectHighlightedSigns.has(sign);
      const isElementHighlighted = elementHighlightedSigns?.has(sign) ?? false;
      const isModalityHighlighted = modalityHighlightedSigns?.has(sign) ?? false;
      const aspectDef = selectedAspect ? ASPECT_DEFINITIONS[selectedAspect] : null;

      if (isCompatSelected) {
        return { stroke: '#fbbf24', strokeWidth: 2.5, dashArray: 'none' };
      }
      if (isAspectHighlighted && aspectDef) {
        return { stroke: aspectDef.color, strokeWidth: 2.5, dashArray: 'none' };
      }
      if (isElementHighlighted) {
        // Use the element color for highlighting
        const signMeta = SIGN_METADATA.find(m => m.sign === sign);
        const elementColors: Record<string, string> = {
          Fire: '#ef4444',
          Earth: '#84cc16',
          Air: '#38bdf8',
          Water: '#6366f1',
        };
        const color = signMeta ? elementColors[signMeta.element] : '#fbbf24';
        return { stroke: color, strokeWidth: 2.5, dashArray: 'none' };
      }
      if (isModalityHighlighted) {
        // Use yellow for modality highlighting to make it obvious
        return { stroke: '#fbbf24', strokeWidth: 2.5, dashArray: 'none' };
      }
      return { stroke: 'rgba(255, 255, 255, 0.12)', strokeWidth: 1, dashArray: '3,6' };
    };

    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const style = getSpokeStyle(arc.sign);

      // Spoke from inner edge of sign segment to center (0,0)
      spokesGroup.append('line')
        .attr('x1', 0)  // Center
        .attr('y1', 0)  // Center
        .attr('x2', Math.cos(midAngle) * signInnerRadius)
        .attr('y2', Math.sin(midAngle) * signInnerRadius)
        .attr('stroke', style.stroke)
        .attr('stroke-width', style.strokeWidth)
        .attr('stroke-dasharray', style.dashArray)
        .attr('class', `spoke spoke-${arc.sign.toLowerCase()}`);
    });

    // Season arc generator (thinner)
    const seasonArcGen = d3.arc<D3SeasonArc>()
      .innerRadius(seasonInnerRadius)
      .outerRadius(seasonOuterRadius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.02)
      .cornerRadius(3);

    // Sign arc generator (larger)
    const signArcGen = d3.arc<D3SignArc>()
      .innerRadius(signInnerRadius)
      .outerRadius(signOuterRadius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.01)
      .cornerRadius(2);

    // Element arc generator
    const elementArcGen = d3.arc<D3SignArc>()
      .innerRadius(elementInnerRadius)
      .outerRadius(elementOuterRadius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.01)
      .cornerRadius(2);

    // Modality arc generator (Cardinal, Fixed, Mutable)
    const modalityArcGen = d3.arc<D3SignArc>()
      .innerRadius(modalityInnerRadius)
      .outerRadius(modalityOuterRadius)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.01)
      .cornerRadius(2);

    // Helper to get element label and color for each sign
    const getElementLabel = (element: string): { label: string; color: string } => {
      switch (element) {
        case 'Fire': return { label: 'FIRE', color: '#ef4444' };
        case 'Earth': return { label: 'EARTH', color: '#22c55e' };
        case 'Air': return { label: 'AIR', color: '#38bdf8' };
        case 'Water': return { label: 'WATER', color: '#8b5cf6' };
        default: return { label: '', color: '#6b7280' };
      }
    };

    // Draw element ring (shows FIRE, EARTH, AIR, WATER for each sign)
    // When a specific element is highlighted, only that element's sectors are bright
    const elementGroup = g.append('g').attr('class', 'element-ring')
      .style('opacity', getModeOpacity('element'));

    // Get the selected sign's element for teaching mode highlighting
    const selectedSignElement = selectedSign ? SIGN_METADATA.find(m => m.sign === selectedSign)?.element : null;

    elementGroup.selectAll('path')
      .data(signArcs)
      .join('path')
      .attr('d', elementArcGen)
      .attr('fill', d => {
        const elementInfo = getElementLabel(d.element);
        return elementInfo.color;
      })
      .attr('opacity', d => {
        // Check if this sign matches active constraints (modality, season)
        const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesModality && matchesSeason;

        // If a specific element is highlighted, only show that element's sectors brightly
        // AND they must match other constraints (modality, season)
        if (highlightedElement) {
          if (d.element === highlightedElement && matchesConstraints) return 1;
          return 0.2;
        }
        // If modality or season is selected (but not element), dim non-matching signs
        if (highlightedModality || selectedSeason) {
          return matchesConstraints ? 0.8 : 0.2;
        }
        // Teaching mode: when a sign is selected, highlight only its element
        if (selectedSign && selectedSignElement) {
          return d.element === selectedSignElement ? 1 : 0.2;
        }
        return 0.7;
      })
      .attr('stroke', d => {
        // Check if this sign matches active constraints (modality, season)
        const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesModality && matchesSeason;

        // Yellow border for highlighted element sectors that match ALL constraints
        if (highlightedElement && d.element === highlightedElement && matchesConstraints) {
          return '#fbbf24';
        }
        // Teaching mode: yellow border for selected sign's element
        if (selectedSign && selectedSignElement && d.element === selectedSignElement) {
          return '#fbbf24';
        }
        return '#1e293b';
      })
      .attr('stroke-width', d => {
        const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesModality && matchesSeason;

        const isHighlighted = (highlightedElement && d.element === highlightedElement && matchesConstraints) ||
                              (selectedSign && selectedSignElement && d.element === selectedSignElement);
        return isHighlighted ? 3 : 1;
      })
      .style('filter', d => {
        const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesModality && matchesSeason;

        const isHighlighted = (highlightedElement && d.element === highlightedElement && matchesConstraints) ||
                              (selectedSign && selectedSignElement && d.element === selectedSignElement);
        return isHighlighted ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' : 'none';
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1);
        onHoverElement(d.element);
      })
      .on('mouseout', function(event, d) {
        // Restore opacity based on all active constraints
        const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesModality && matchesSeason;

        let restoreOpacity = 0.7;
        if (highlightedElement) {
          restoreOpacity = (d.element === highlightedElement && matchesConstraints) ? 1 : 0.2;
        } else if (highlightedModality || selectedSeason) {
          restoreOpacity = matchesConstraints ? 0.8 : 0.2;
        } else if (selectedSign && selectedSignElement) {
          restoreOpacity = d.element === selectedSignElement ? 1 : 0.2;
        }

        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', restoreOpacity);
        onHoverElement(null);
      });

    // Add element labels INSIDE the element ring (FIRE, EARTH, AIR, WATER)
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (elementInnerRadius + elementOuterRadius) / 2;
      const elementInfo = getElementLabel(arc.element);

      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      const labelX = Math.cos(midAngle) * labelR;
      const labelY = Math.sin(midAngle) * labelR;

      elementGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${labelX}, ${labelY})`)
        .style('font-size', '8px')
        .style('font-weight', '700')
        .style('fill', '#fff')
        .style('letter-spacing', '0.5px')
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
        .style('pointer-events', 'none')
        .text(elementInfo.label);
    });

    // Yellow highlight borders when Elements mode is active
    if (wheelMode === 'elements') {
      g.append('circle')
        .attr('r', elementInnerRadius)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
      g.append('circle')
        .attr('r', elementOuterRadius)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
    }

    // Draw modality ring (Cardinal, Fixed, Mutable)
    const modalityGroup = g.append('g').attr('class', 'modality-ring')
      .style('opacity', getModeOpacity('modality'));

    // Modality colors - must match legend colors
    const getModalityColor = (modality: string): string => {
      switch (modality) {
        case 'Cardinal': return '#f59e0b'; // Amber - initiators
        case 'Fixed': return '#8b5cf6';    // Purple - sustainers
        case 'Mutable': return '#06b6d4';  // Cyan - adapters
        default: return '#6b7280';
      }
    };

    // Get the selected sign's modality for teaching mode highlighting
    const selectedSignModality = selectedSign ? SIGN_METADATA.find(m => m.sign === selectedSign)?.modality : null;

    modalityGroup.selectAll('path')
      .data(signArcs)
      .join('path')
      .attr('d', modalityArcGen)
      .attr('fill', d => getModalityColor(d.modality))
      .attr('opacity', d => {
        // Check if this sign matches active constraints (element, season)
        const matchesElement = !highlightedElement || elementHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesElement && matchesSeason;

        // If a specific modality is highlighted, only show that modality's sectors brightly
        // AND they must match other constraints (element, season)
        if (highlightedModality) {
          if (d.modality === highlightedModality && matchesConstraints) return 1;
          return 0.2;
        }
        // If element or season is selected (but not modality), dim non-matching signs
        if (highlightedElement || selectedSeason) {
          return matchesConstraints ? 0.8 : 0.2;
        }
        // Teaching mode: when a sign is selected, highlight only its modality
        if (selectedSign && selectedSignModality) {
          return d.modality === selectedSignModality ? 1 : 0.2;
        }
        return 0.65;
      })
      .attr('stroke', d => {
        // Check if this sign matches active constraints (element, season)
        const matchesElement = !highlightedElement || elementHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesElement && matchesSeason;

        // Yellow border for highlighted modality sectors that match ALL constraints
        if (highlightedModality && d.modality === highlightedModality && matchesConstraints) {
          return '#fbbf24';
        }
        // Teaching mode: yellow border for selected sign's modality
        if (selectedSign && selectedSignModality && d.modality === selectedSignModality) {
          return '#fbbf24';
        }
        return '#1e293b';
      })
      .attr('stroke-width', d => {
        const matchesElement = !highlightedElement || elementHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesElement && matchesSeason;

        const isHighlighted = (highlightedModality && d.modality === highlightedModality && matchesConstraints) ||
                              (selectedSign && selectedSignModality && d.modality === selectedSignModality);
        return isHighlighted ? 3 : 1;
      })
      .style('filter', d => {
        const matchesElement = !highlightedElement || elementHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesElement && matchesSeason;

        const isHighlighted = (highlightedModality && d.modality === highlightedModality && matchesConstraints) ||
                              (selectedSign && selectedSignModality && d.modality === selectedSignModality);
        return isHighlighted ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' : 'none';
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1);
        onHoverModality(d.modality);
      })
      .on('mouseout', function(event, d) {
        // Restore opacity based on all active constraints
        const matchesElement = !highlightedElement || elementHighlightedSigns?.has(d.sign);
        const matchesSeason = !selectedSeason || d.season === selectedSeason;
        const matchesConstraints = matchesElement && matchesSeason;

        let restoreOpacity = 0.65;
        if (highlightedModality) {
          restoreOpacity = (d.modality === highlightedModality && matchesConstraints) ? 1 : 0.2;
        } else if (highlightedElement || selectedSeason) {
          restoreOpacity = matchesConstraints ? 0.8 : 0.2;
        } else if (selectedSign && selectedSignModality) {
          restoreOpacity = d.modality === selectedSignModality ? 1 : 0.2;
        }

        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', restoreOpacity);
        onHoverModality(null);
      });

    // Add modality labels (Cardinal, Fixed, Mutable)
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (modalityInnerRadius + modalityOuterRadius) / 2;

      // Full labels
      const modalityLabel = arc.modality === 'Cardinal' ? 'CARDINAL' :
                            arc.modality === 'Fixed' ? 'FIXED' : 'MUTABLE';

      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      const labelX = Math.cos(midAngle) * labelR;
      const labelY = Math.sin(midAngle) * labelR;

      modalityGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${labelX}, ${labelY})`)
        .style('font-size', '7px')
        .style('font-weight', '700')
        .style('fill', '#fff')
        .style('letter-spacing', '0.3px')
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
        .style('pointer-events', 'none')
        .text(modalityLabel);
    });

    // Yellow highlight borders when Modality mode is active
    if (wheelMode === 'modality') {
      g.append('circle')
        .attr('r', modalityInnerRadius)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
      g.append('circle')
        .attr('r', modalityOuterRadius)
        .attr('fill', 'none')
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
    }

    // Draw seasons (thin outer ring)
    const seasonGroup = g.append('g').attr('class', 'seasons-ring')
      .style('opacity', getModeOpacity('seasons'));

    seasonGroup.selectAll('path')
      .data(seasonArcs)
      .join('path')
      .attr('d', seasonArcGen)
      .attr('fill', d => d.color)
      .attr('stroke', d => selectedSeason === d.season ? '#fbbf24' : '#1e293b')
      .attr('stroke-width', d => selectedSeason === d.season ? 3 : 2)
      .attr('opacity', d => {
        // Dim non-selected seasons when one is selected
        if (selectedSeason && selectedSeason !== d.season) return 0.3;
        // Dim seasons that don't contain the selected sign (quizlet teaching mode)
        if (selectedSign) {
          const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
          if (signMeta && signMeta.season !== d.season) return 0.3;
        }
        return 1;
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Skip hover effects if a season is already selected
        if (selectedSeason) return;
        // Dim other season arcs
        g.selectAll('.seasons-ring path')
          .transition()
          .duration(150)
          .attr('opacity', (arcData: typeof d) => arcData.season === d.season ? 1 : 0.4);
        // Dim signs not in this season
        g.selectAll('.signs-ring path')
          .transition()
          .duration(150)
          .attr('opacity', (signData: SignArcData) => {
            const seasonMeta = SIGN_METADATA.find(m => m.sign === signData.sign);
            return seasonMeta?.season === d.season ? 1 : 0.4;
          });
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', function() {
            const [cx, cy] = seasonArcGen.centroid(d);
            const angle = Math.atan2(cy, cx);
            return `translate(${Math.cos(angle) * 5}, ${Math.sin(angle) * 5})`;
          });
      })
      .on('mouseout', function() {
        // Skip if a season is selected (maintain selection state)
        if (selectedSeason) return;
        // Reset all opacities
        g.selectAll('.seasons-ring path')
          .transition()
          .duration(150)
          .attr('opacity', 1);
        g.selectAll('.signs-ring path')
          .transition()
          .duration(150)
          .attr('opacity', 1);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', 'translate(0, 0)');
      })
      .on('click', (event, d) => {
        onSeasonClick(d.season);
      });

    // Add season phase labels INSIDE the season ring (BEGINNING, CORE, TRANSITION)
    // Based on modality: Cardinal=Beginning, Fixed=Core, Mutable=Transition
    const getSeasonPhaseLabel = (modality: string): string => {
      switch (modality) {
        case 'Cardinal': return 'BEGINNING';
        case 'Fixed': return 'CORE';
        case 'Mutable': return 'TRANSITION';
        default: return '';
      }
    };

    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (seasonInnerRadius + seasonOuterRadius) / 2;
      const phaseLabel = getSeasonPhaseLabel(arc.modality);

      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      const labelX = Math.cos(midAngle) * labelR;
      const labelY = Math.sin(midAngle) * labelR;

      seasonGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${labelX}, ${labelY})`)
        .style('font-size', phaseLabel === 'TRANSITION' ? '8px' : '9px')
        .style('font-weight', '700')
        .style('fill', '#fff')
        .style('letter-spacing', '0.5px')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.7)')
        .style('pointer-events', 'none')
        .text(phaseLabel);
    });

    // External season labels with pointers
    const labelRadius = totalRadius + 65;
    const seasonLabelGroup = g.append('g').attr('class', 'season-labels-external');

    seasonArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const pointerStart = seasonOuterRadius + 2;
      const pointerEnd = labelRadius - 8;
      const isSelected = selectedSeason === arc.season;
      const isDimmed = selectedSeason && selectedSeason !== arc.season;

      // Pointer line from ring to label
      seasonLabelGroup.append('line')
        .attr('x1', Math.cos(midAngle) * pointerStart)
        .attr('y1', Math.sin(midAngle) * pointerStart)
        .attr('x2', Math.cos(midAngle) * pointerEnd)
        .attr('y2', Math.sin(midAngle) * pointerEnd)
        .attr('stroke', isSelected ? '#fbbf24' : arc.color)
        .attr('stroke-width', isSelected ? 2.5 : 1.5)
        .attr('opacity', isDimmed ? 0.3 : 0.6);

      // Small circle at end of pointer (clickable)
      seasonLabelGroup.append('circle')
        .attr('cx', Math.cos(midAngle) * pointerEnd)
        .attr('cy', Math.sin(midAngle) * pointerEnd)
        .attr('r', isSelected ? 6 : 4)
        .attr('fill', isSelected ? '#fbbf24' : arc.color)
        .attr('opacity', isDimmed ? 0.3 : 1)
        .style('cursor', 'pointer')
        .on('click', () => onSeasonClick(arc.season));

      // External label text (clickable)
      const labelX = Math.cos(midAngle) * labelRadius;
      const labelY = Math.sin(midAngle) * labelRadius;

      seasonLabelGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', isSelected ? '16px' : '14px')
        .style('font-weight', isSelected ? '700' : '600')
        .style('fill', isSelected ? '#fbbf24' : arc.color)
        .style('opacity', isDimmed ? 0.3 : 1)
        .style('cursor', 'pointer')
        .style('text-shadow', isSelected ? '0 0 10px rgba(251, 191, 36, 0.5)' : 'none')
        .on('click', () => onSeasonClick(arc.season))
        .text(`${arc.icon} ${arc.season}`);
    });

    // Add animated seasonal flow pulse (subtle clockwise rotation)
    // This reinforces: "The zodiac is a cycle, not 12 isolated traits"
    const flowPulseGroup = g.append('g').attr('class', 'flow-pulse-container');

    // Create the animated pulse arc (sits just outside the season ring)
    const pulseRadius = seasonOuterRadius + 4;
    const pulseThickness = 6;

    // Use imported pulse colors for flowing effect
    const pulseArc = d3.arc<any>()
      .innerRadius(pulseRadius)
      .outerRadius(pulseRadius + pulseThickness)
      .startAngle((d: any) => d.startAngle)
      .endAngle((d: any) => d.startAngle + Math.PI / 6); // 30° arc segment

    // Add the pulse segments
    const pulses = flowPulseGroup.selectAll('.flow-pulse-segment')
      .data(SEASON_PULSE_COLORS)
      .join('path')
      .attr('class', 'flow-pulse-segment')
      .attr('d', pulseArc)
      .attr('fill', d => d.color)
      .attr('opacity', 0.6)
      .style('filter', 'blur(1px) drop-shadow(0 0 4px currentColor)')
      .style('pointer-events', 'none');

    // Animate with D3 timer for smooth clockwise rotation
    const rotationDuration = 20000; // 20 seconds per full rotation
    let startTime: number | null = null;

    const animatePulse = (elapsed: number) => {
      if (startTime === null) startTime = elapsed;
      const progress = ((elapsed - startTime) % rotationDuration) / rotationDuration;
      const rotation = progress * 360;

      flowPulseGroup.attr('transform', `rotate(${rotation})`);

      // Pulse opacity for breathing effect
      const breathe = 0.4 + 0.4 * Math.sin(elapsed / 1000);
      pulses.attr('opacity', breathe);
    };

    // Start the animation
    const pulseTimer = d3.timer(animatePulse);

    // Store timer reference for cleanup
    (window as any).__pulseTimer = pulseTimer;

    // Add Equinox/Solstice markers at cardinal sign boundaries (using imported data)
    const celestialGroup = g.append('g').attr('class', 'celestial-events');
    const celestialRadius = seasonOuterRadius + 40;

    CELESTIAL_EVENTS.forEach(event => {
      const angleRad = (event.angle - 90) * Math.PI / 180; // -90 to align with D3 (0=top)
      const markerX = Math.cos(angleRad) * celestialRadius;
      const markerY = Math.sin(angleRad) * celestialRadius;

      // Small diamond marker at the celestial point (interactive)
      const diamondSize = 8;
      celestialGroup.append('path')
        .attr('d', `M ${markerX} ${markerY - diamondSize}
                    L ${markerX + diamondSize} ${markerY}
                    L ${markerX} ${markerY + diamondSize}
                    L ${markerX - diamondSize} ${markerY} Z`)
        .attr('fill', event.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
        .style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))')
        .on('mouseover', function() {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('opacity', 1)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))');
          onHoverCelestialEvent(event.id);
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('opacity', 0.9)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))');
          onHoverCelestialEvent(null);
        });

      // Label positioning based on angle
      const labelOffset = 20;
      let textAnchor = 'middle';
      let dy = 0;
      let labelX = markerX;
      let labelY = markerY;

      if (event.angle === 0) { // Top
        labelY = markerY - labelOffset;
        dy = -2;
      } else if (event.angle === 90) { // Right
        labelX = markerX + labelOffset;
        textAnchor = 'start';
      } else if (event.angle === 180) { // Bottom
        labelY = markerY + labelOffset;
        dy = 4;
      } else if (event.angle === 270) { // Left
        labelX = markerX - labelOffset;
        textAnchor = 'end';
      }

      celestialGroup.append('text')
        .attr('x', labelX)
        .attr('y', labelY)
        .attr('dy', dy)
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .style('font-size', '9px')
        .style('font-weight', '600')
        .style('fill', event.color)
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)')
        .style('pointer-events', 'none')
        .text(event.label);
    });

    // Store imported constants in window for tooltip UI components
    (window as any).__celestialEvents = CELESTIAL_EVENTS;
    (window as any).__signTooltips = SIGN_TOOLTIPS;
    (window as any).__elementTooltips = ELEMENT_TOOLTIPS;
    (window as any).__modalityTooltips = MODALITY_TOOLTIPS;

    // Add clockwise flow arrows between seasons
    const arrowRadius = seasonOuterRadius + 20;
    const arrowGroup = g.append('g').attr('class', 'season-flow-arrows');

    // Define arrowhead marker - prominent and visible
    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    defs.selectAll('#season-arrow').remove();
    defs.append('marker')
      .attr('id', 'season-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'rgba(255, 255, 255, 0.6)');

    // Create curved arrows between each season (clockwise: Spring->Summer->Autumn->Winter->Spring)
    // Season midpoints: Spring=0°, Summer=90°, Autumn=180°, Winter=270°
    const seasonAngles = [
      { start: -70, end: 40 },   // Spring to Summer (longer arc)
      { start: 20, end: 130 },   // Summer to Autumn (longer arc)
      { start: 110, end: 220 },  // Autumn to Winter (longer arc)
      { start: 200, end: 310 },  // Winter to Spring (longer arc)
    ];

    seasonAngles.forEach(({ start, end }) => {
      const startRad = (start - 90) * Math.PI / 180;
      const endRad = (end - 90) * Math.PI / 180;

      // Draw as a curved line with arrowhead
      const x1 = Math.cos(startRad) * arrowRadius;
      const y1 = Math.sin(startRad) * arrowRadius;
      const x2 = Math.cos(endRad) * arrowRadius;
      const y2 = Math.sin(endRad) * arrowRadius;

      // Use arc for smoother curve
      const largeArc = Math.abs(end - start) > 180 ? 1 : 0;

      arrowGroup.append('path')
        .attr('d', `M ${x1} ${y1} A ${arrowRadius} ${arrowRadius} 0 ${largeArc} 1 ${x2} ${y2}`)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.35)')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '10,5')
        .attr('marker-end', 'url(#season-arrow)');
    });

    // Draw signs (main ring)
    const signGroup = g.append('g').attr('class', 'signs-ring')
      .style('opacity', getModeOpacity('signs'));

    signGroup.selectAll('path')
      .data(signArcs)
      .join('path')
      .attr('d', signArcGen)
      .attr('fill', d => d.color)
      .attr('stroke', d => {
        const isElementHighlighted = elementHighlightedSigns?.has(d.sign) ?? false;
        const isModalityHighlighted = modalityHighlightedSigns?.has(d.sign) ?? false;
        if (isSignSelected(d.sign) || d.sign === selectedSign || d.sign === aspectReferenceSign) return '#fbbf24';
        if (isElementHighlighted) {
          const elementColors: Record<string, string> = { Fire: '#ef4444', Earth: '#84cc16', Air: '#38bdf8', Water: '#6366f1' };
          return elementColors[d.element] || '#fbbf24';
        }
        if (isModalityHighlighted) {
          // Use the modality's color to match the modality ring (consistent highlighting)
          const modalityColors: Record<string, string> = { Cardinal: '#f59e0b', Fixed: '#8b5cf6', Mutable: '#06b6d4' };
          return modalityColors[d.modality] || '#fbbf24';
        }
        return '#1e293b';
      })
      .attr('stroke-width', d => {
        const isElementHighlighted = elementHighlightedSigns?.has(d.sign) ?? false;
        const isModalityHighlighted = modalityHighlightedSigns?.has(d.sign) ?? false;
        return (isSignSelected(d.sign) || d.sign === selectedSign || d.sign === aspectReferenceSign || isElementHighlighted || isModalityHighlighted) ? 3 : 1.5;
      })
      .attr('opacity', d => {
        // Dim non-matching signs when element, modality, season, or single sign is highlighted
        const isElementHighlighted = elementHighlightedSigns?.has(d.sign) ?? false;
        const isModalityHighlighted = modalityHighlightedSigns?.has(d.sign) ?? false;
        const hasElementSelection = highlightedElement !== null && highlightedElement !== undefined;
        const hasModalitySelection = highlightedModality !== null && highlightedModality !== undefined;

        // Dim other signs when a single sign is selected (quizlet teaching mode)
        if (selectedSign && d.sign !== selectedSign) {
          return 0.3;
        }

        // Check if sign is in the selected season
        if (selectedSeason) {
          const signMeta = SIGN_METADATA.find(m => m.sign === d.sign);
          if (signMeta?.season !== selectedSeason) return 0.3;
        }

        if (hasElementSelection && !isElementHighlighted) return 0.3;
        if (hasModalitySelection && !isModalityHighlighted) return 0.3;
        return 1;
      })
      .style('cursor', 'pointer')
      .style('pointer-events', 'visiblePainted')
      .on('mouseover', function(event, d) {
        // Dim other sign arcs
        g.selectAll('.signs-ring path')
          .transition()
          .duration(150)
          .attr('opacity', (signData: SignArcData) => signData.sign === d.sign ? 1 : 0.4);
        // Dim season arcs
        g.selectAll('.seasons-ring path')
          .transition()
          .duration(150)
          .attr('opacity', 0.4);
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', function() {
            const [cx, cy] = signArcGen.centroid(d);
            const angle = Math.atan2(cy, cx);
            return `translate(${Math.cos(angle) * 4}, ${Math.sin(angle) * 4})`;
          });
        onHoverSign(d.sign);
      })
      .on('mouseout', function() {
        // Restore opacities based on active constraints
        g.selectAll('.signs-ring path')
          .transition()
          .duration(150)
          .attr('opacity', (signData: SignArcData) => {
            const isElementHighlighted = elementHighlightedSigns?.has(signData.sign) ?? false;
            const isModalityHighlighted = modalityHighlightedSigns?.has(signData.sign) ?? false;
            const hasElementSelection = highlightedElement !== null && highlightedElement !== undefined;
            const hasModalitySelection = highlightedModality !== null && highlightedModality !== undefined;

            // Dim other signs when a single sign is selected
            if (selectedSign && signData.sign !== selectedSign) return 0.3;

            // Check if sign is in the selected season
            if (selectedSeason) {
              const signMeta = SIGN_METADATA.find(m => m.sign === signData.sign);
              if (signMeta?.season !== selectedSeason) return 0.3;
            }

            if (hasElementSelection && !isElementHighlighted) return 0.3;
            if (hasModalitySelection && !isModalityHighlighted) return 0.3;
            return 1;
          });
        // Restore season ring opacity
        g.selectAll('.seasons-ring path')
          .transition()
          .duration(150)
          .attr('opacity', (seasonData: D3SeasonArc) => {
            if (selectedSeason && selectedSeason !== seasonData.season) return 0.3;
            if (selectedSign) {
              const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
              if (signMeta && signMeta.season !== seasonData.season) return 0.3;
            }
            return 1;
          });
        d3.select(this)
          .transition()
          .duration(150)
          .attr('transform', 'translate(0, 0)');
        onHoverSign(null);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        onSignClick(d.sign);
      });

    // Sign symbols and names along radial axis
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const isSelected = isSignSelected(arc.sign) || arc.sign === selectedSign;

      // Position for symbol (closer to center)
      const symbolRadius = signInnerRadius + (signOuterRadius - signInnerRadius) * 0.3;
      const symbolX = Math.cos(midAngle) * symbolRadius;
      const symbolY = Math.sin(midAngle) * symbolRadius;

      // Position for name (closer to outer edge)
      const nameRadius = signInnerRadius + (signOuterRadius - signInnerRadius) * 0.7;
      const nameX = Math.cos(midAngle) * nameRadius;
      const nameY = Math.sin(midAngle) * nameRadius;

      // Calculate rotation for radial text (readable from outside)
      let rotation = (midAngle * 180 / Math.PI) + 90;
      // Flip text on bottom half to keep it readable
      if (rotation > 90 && rotation < 270) {
        rotation += 180;
      }

      // Symbol
      signGroup.append('text')
        .attr('class', 'sign-symbol')
        .attr('x', symbolX)
        .attr('y', symbolY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', isSelected ? '24px' : '20px')
        .style('fill', isSelected ? '#fbbf24' : '#fff')
        .style('font-weight', isSelected ? '700' : '400')
        .style('pointer-events', 'none')
        .text(arc.symbol);

      // Name along radial axis
      signGroup.append('text')
        .attr('class', 'sign-name')
        .attr('x', nameX)
        .attr('y', nameY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(${rotation}, ${nameX}, ${nameY})`)
        .style('font-size', '9px')
        .style('font-weight', '500')
        .style('fill', isSelected ? '#fbbf24' : 'rgba(255, 255, 255, 0.85)')
        .style('letter-spacing', '0.5px')
        .style('pointer-events', 'none')
        .text(arc.sign.toUpperCase());

      // Selection label (A/B) for selected signs
      if (isSelected) {
        const selectionRadius = signOuterRadius + 18;
        signGroup.append('text')
          .attr('class', 'selection-label')
          .attr('x', Math.cos(midAngle) * selectionRadius)
          .attr('y', Math.sin(midAngle) * selectionRadius)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .style('font-size', '11px')
          .style('font-weight', '700')
          .style('fill', '#fbbf24')
          .style('background', 'rgba(0,0,0,0.5)')
          .style('pointer-events', 'none')
          .text(getSignSelectionLabel(arc.sign));
      }
    });

    // Cleanup: stop the pulse animation timer when effect re-runs or unmounts
    return () => {
      if ((window as any).__pulseTimer) {
        (window as any).__pulseTimer.stop();
        (window as any).__pulseTimer = null;
      }
    };

  }, [
    dimensions,
    seasonArcs,
    signArcs,
    viewMode,
    selectedSign,
    signA,
    signB,
    selectedAspect,
    aspectHighlightedSigns,
    aspectReferenceSign,
    elementHighlightedSigns,
    highlightedElement,
    modalityHighlightedSigns,
    highlightedModality,
    selectedSeason,
    onSignClick,
    onSeasonClick,
    onHoverSign,
    onHoverElement,
    onHoverModality,
    onHoverCelestialEvent,
    onHoverAspect,
    wheelMode,
  ]);

  return <svg ref={svgRef} />;
};

export default TropicalZodiacWheel;
