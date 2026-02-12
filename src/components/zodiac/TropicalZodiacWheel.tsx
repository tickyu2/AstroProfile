/**
 * TropicalZodiacWheel.tsx
 *
 * D3-based zodiac wheel visualization component.
 * Renders concentric rings: Signs, Elements, Modalities, Seasons
 * with interactive hover/click handlers and animated pulse effects.
 *
 * Refactored for cleaner code with shared constraint helpers.
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
type SignArcData = D3SignArc;

export interface TropicalZodiacWheelProps {
  dimensions: { width: number; height: number };
  seasonArcs: D3SeasonArc[];
  signArcs: D3SignArc[];
  viewMode: ViewMode;
  selectedSign: ZodiacSign | null;
  signA: ZodiacSign | null;
  signB: ZodiacSign | null;
  selectedAspect: AspectType | null;
  aspectHighlightedSigns: Set<ZodiacSign>;
  aspectReferenceSign: ZodiacSign | null;
  elementHighlightedSigns?: Set<ZodiacSign>;
  highlightedElement?: string | null;
  modalityHighlightedSigns?: Set<ZodiacSign>;
  highlightedModality?: string | null;
  selectedSeason?: Season | null;
  onSignClick: (sign: ZodiacSign) => void;
  onSeasonClick: (season: Season) => void;
  onHoverSign: (sign: string | null) => void;
  onHoverElement: (element: string | null) => void;
  onHoverModality: (modality: string | null) => void;
  onHoverCelestialEvent: (id: string | null) => void;
  onHoverAspect?: (aspectKey: AspectKey | null) => void;
  onPlanetClick?: (planet: string) => void;
}

// =============================================================================
// CONSTANTS - Centralized color and label lookups
// =============================================================================

const ELEMENT_CONFIG: Record<string, { label: string; color: string }> = {
  Fire: { label: 'FIRE', color: '#ef4444' },
  Earth: { label: 'EARTH', color: '#22c55e' },
  Air: { label: 'AIR', color: '#38bdf8' },
  Water: { label: 'WATER', color: '#8b5cf6' },
};

const MODALITY_CONFIG: Record<string, { label: string; color: string; phase: string }> = {
  Cardinal: { label: 'CARDINAL', color: '#f59e0b', phase: 'BEGINNING' },
  Fixed: { label: 'FIXED', color: '#8b5cf6', phase: 'CORE' },
  Mutable: { label: 'MUTABLE', color: '#06b6d4', phase: 'TRANSITION' },
};

const PLANET_COLORS: Record<string, string> = {
  Mars:    '#ef4444',  // red
  Venus:   '#ec4899',  // pink
  Mercury: '#06b6d4',  // cyan
  Moon:    '#a78bfa',  // lavender
  Sun:     '#f59e0b',  // amber
  Jupiter: '#8b5cf6',  // purple
  Saturn:  '#64748b',  // slate
};

const SIGN_RULERS: Record<string, { planet: string; glyph: string }> = {
  Aries:       { planet: 'Mars',    glyph: '\u2642' },
  Taurus:      { planet: 'Venus',   glyph: '\u2640' },
  Gemini:      { planet: 'Mercury', glyph: '\u263F' },
  Cancer:      { planet: 'Moon',    glyph: '\u263D' },
  Leo:         { planet: 'Sun',     glyph: '\u2609' },
  Virgo:       { planet: 'Mercury', glyph: '\u263F' },
  Libra:       { planet: 'Venus',   glyph: '\u2640' },
  Scorpio:     { planet: 'Mars',    glyph: '\u2642' },
  Sagittarius: { planet: 'Jupiter', glyph: '\u2643' },
  Capricorn:   { planet: 'Saturn',  glyph: '\u2644' },
  Aquarius:    { planet: 'Saturn',  glyph: '\u2644' },
  Pisces:      { planet: 'Jupiter', glyph: '\u2643' },
};

const DEFAULT_STROKE = '#1e293b';
const HIGHLIGHT_STROKE = '#fbbf24';
const HIGHLIGHT_GLOW = 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Check if a sign matches all active constraints */
interface ConstraintParams {
  sign: ZodiacSign;
  season: Season;
  element: string;
  modality: string;
  selectedSeason: Season | null | undefined;
  highlightedElement: string | null | undefined;
  highlightedModality: string | null | undefined;
  elementHighlightedSigns?: Set<ZodiacSign>;
  modalityHighlightedSigns?: Set<ZodiacSign>;
}

function checkConstraints(params: ConstraintParams) {
  const {
    sign, season, element, modality,
    selectedSeason, highlightedElement, highlightedModality,
    elementHighlightedSigns, modalityHighlightedSigns
  } = params;

  const matchesSeason = !selectedSeason || season === selectedSeason;
  const matchesElement = !highlightedElement || elementHighlightedSigns?.has(sign);
  const matchesModality = !highlightedModality || modalityHighlightedSigns?.has(sign);

  return {
    matchesSeason,
    matchesElement,
    matchesModality,
    matchesAllForElement: matchesModality && matchesSeason, // For element ring
    matchesAllForModality: matchesElement && matchesSeason, // For modality ring
    matchesAll: matchesSeason && matchesElement && matchesModality,
  };
}

/** Calculate opacity for element ring segment */
function getElementRingOpacity(
  d: D3SignArc,
  constraints: ReturnType<typeof checkConstraints>,
  highlightedElement: string | null | undefined,
  highlightedModality: string | null | undefined,
  selectedSeason: Season | null | undefined,
  selectedSign: ZodiacSign | null,
  selectedSignElement: string | null
): number {
  if (highlightedElement) {
    return (d.element === highlightedElement && constraints.matchesAllForElement) ? 1 : 0.2;
  }
  if (highlightedModality || selectedSeason) {
    return constraints.matchesAllForElement ? 0.8 : 0.2;
  }
  if (selectedSign && selectedSignElement) {
    return d.element === selectedSignElement ? 1 : 0.2;
  }
  return 0.7;
}

/** Calculate opacity for modality ring segment */
function getModalityRingOpacity(
  d: D3SignArc,
  constraints: ReturnType<typeof checkConstraints>,
  highlightedModality: string | null | undefined,
  highlightedElement: string | null | undefined,
  selectedSeason: Season | null | undefined,
  selectedSign: ZodiacSign | null,
  selectedSignModality: string | null
): number {
  if (highlightedModality) {
    return (d.modality === highlightedModality && constraints.matchesAllForModality) ? 1 : 0.2;
  }
  if (highlightedElement || selectedSeason) {
    return constraints.matchesAllForModality ? 0.8 : 0.2;
  }
  if (selectedSign && selectedSignModality) {
    return d.modality === selectedSignModality ? 1 : 0.2;
  }
  return 0.65;
}

/** Calculate opacity for sign ring segment */
function getSignRingOpacity(
  d: D3SignArc,
  selectedSign: ZodiacSign | null,
  selectedSeason: Season | null | undefined,
  highlightedElement: string | null | undefined,
  highlightedModality: string | null | undefined,
  elementHighlightedSigns?: Set<ZodiacSign>,
  modalityHighlightedSigns?: Set<ZodiacSign>
): number {
  const isElementHighlighted = elementHighlightedSigns?.has(d.sign) ?? false;
  const isModalityHighlighted = modalityHighlightedSigns?.has(d.sign) ?? false;

  if (selectedSign && d.sign !== selectedSign) return 0.3;
  if (selectedSeason) {
    const signMeta = SIGN_METADATA.find(m => m.sign === d.sign);
    if (signMeta?.season !== selectedSeason) return 0.3;
  }
  if (highlightedElement && !isElementHighlighted) return 0.3;
  if (highlightedModality && !isModalityHighlighted) return 0.3;
  return 1;
}

/** Get highlight state for ring segments */
function isSegmentHighlighted(
  d: D3SignArc,
  ringType: 'element' | 'modality',
  constraints: ReturnType<typeof checkConstraints>,
  highlightedElement: string | null | undefined,
  highlightedModality: string | null | undefined,
  selectedSign: ZodiacSign | null,
  selectedSignAttribute: string | null
): boolean {
  if (ringType === 'element') {
    return (highlightedElement && d.element === highlightedElement && constraints.matchesAllForElement) ||
           (selectedSign && selectedSignAttribute && d.element === selectedSignAttribute) || false;
  }
  return (highlightedModality && d.modality === highlightedModality && constraints.matchesAllForModality) ||
         (selectedSign && selectedSignAttribute && d.modality === selectedSignAttribute) || false;
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
  onPlanetClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Get wheel mode with fallback
  let wheelMode = 'default';
  try {
    const modeContext = useWheelMode();
    wheelMode = modeContext.mode;
  } catch {
    // Not wrapped in WheelModeProvider
  }

  // Opacity helper based on current mode
  const getModeOpacity = (layer: 'seasons' | 'modality' | 'element' | 'signs' | 'center'): number => {
    const DIM = 0.35;
    if (wheelMode === 'default') return 1;
    const modeMap: Record<string, string> = {
      seasons: 'seasons', modality: 'modality', elements: 'element', signs: 'signs'
    };
    return modeMap[wheelMode] === layer ? 1 : DIM;
  };

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Clear all hover states on mouse leave
    svg.on('mouseleave', () => {
      onHoverSign(null);
      onHoverElement(null);
      onHoverModality(null);
      onHoverCelestialEvent(null);
      onHoverAspect?.(null);
    });

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const totalRadius = Math.min(width, height) / 2 - 25;

    // Ring radii calculations
    const centerRadius = totalRadius * 0.234375;
    const signInnerRadius = centerRadius + 5;
    const signOuterRadius = totalRadius * 0.64;
    const elementInnerRadius = signOuterRadius + 2;
    const elementOuterRadius = totalRadius * 0.72;
    const modalityInnerRadius = elementOuterRadius + 2;
    const modalityOuterRadius = totalRadius * 0.80;
    const seasonInnerRadius = modalityOuterRadius + 2;
    const seasonOuterRadius = totalRadius * 0.92;

    // Main group
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Background for mouse events
    g.append('rect')
      .attr('x', -centerX)
      .attr('y', -centerY)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all')
      .on('mouseover', () => onHoverAspect?.(null));

    // Helper functions
    const isSignSelected = (sign: ZodiacSign) => signA === sign || signB === sign;
    const getSignSelectionLabel = (sign: ZodiacSign): string | null => {
      if (signA === sign) return 'A';
      if (signB === sign) return 'B';
      return null;
    };

    // Get selected sign's attributes for teaching mode
    const selectedSignMeta = selectedSign ? SIGN_METADATA.find(m => m.sign === selectedSign) : null;
    const selectedSignElement = selectedSignMeta?.element ?? null;
    const selectedSignModality = selectedSignMeta?.modality ?? null;

    // Constraint params factory
    const makeConstraintParams = (d: D3SignArc): ConstraintParams => ({
      sign: d.sign,
      season: d.season,
      element: d.element,
      modality: d.modality,
      selectedSeason,
      highlightedElement,
      highlightedModality,
      elementHighlightedSigns,
      modalityHighlightedSigns,
    });

    // =========================================================================
    // CENTER HUB with Aspect Symbols
    // =========================================================================
    g.append('circle')
      .attr('r', centerRadius)
      .attr('fill', 'rgba(15, 23, 42, 0.95)')
      .attr('stroke', 'rgba(255, 255, 255, 0.15)')
      .attr('stroke-width', 2)
      .style('pointer-events', 'all')
      .on('mouseover', () => onHoverAspect?.(null));

    const aspectGroup = g.append('g').attr('class', 'aspect-symbols');
    const aspectKeys: AspectKey[] = ['conjunction', 'semi-sextile', 'sextile', 'square', 'trine', 'quincunx', 'opposition'];
    const aspectSymbolRadius = centerRadius * 0.65;

    aspectKeys.forEach((aspectKey, index) => {
      const aspectData = ASPECT_TOOLTIPS[aspectKey];
      const angle = (index / aspectKeys.length) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * aspectSymbolRadius;
      const y = Math.sin(angle) * aspectSymbolRadius;
      const isSelected = selectedAspect === aspectKey;

      aspectGroup.append('circle')
        .attr('cx', x).attr('cy', y).attr('r', 14)
        .attr('fill', isSelected ? `${aspectData.color}33` : 'transparent')
        .attr('stroke', isSelected ? aspectData.color : 'transparent')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).transition().duration(150)
            .attr('fill', `${aspectData.color}44`).attr('stroke', aspectData.color);
          onHoverAspect?.(aspectKey);
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(150)
            .attr('fill', isSelected ? `${aspectData.color}33` : 'transparent')
            .attr('stroke', isSelected ? aspectData.color : 'transparent');
          onHoverAspect?.(null);
        });

      aspectGroup.append('text')
        .attr('x', x).attr('y', y)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('font-size', '16px')
        .style('fill', isSelected ? aspectData.color : 'rgba(255, 255, 255, 0.7)')
        .style('font-weight', isSelected ? '700' : '400')
        .style('pointer-events', 'none')
        .style('text-shadow', isSelected ? `0 0 8px ${aspectData.color}` : 'none')
        .text(aspectData.symbol);

      aspectGroup.append('text')
        .attr('x', x).attr('y', y + 12)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('font-size', '7px')
        .style('fill', isSelected ? aspectData.color : 'rgba(255, 255, 255, 0.5)')
        .style('pointer-events', 'none')
        .text(`${aspectData.degrees}°`);
    });

    // =========================================================================
    // SPOKES
    // =========================================================================
    const spokesGroup = g.append('g').attr('class', 'spokes');

    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const isCompatSelected = isSignSelected(arc.sign);
      const isAspectHighlighted = aspectHighlightedSigns.has(arc.sign);
      const isElementHighlighted = elementHighlightedSigns?.has(arc.sign) ?? false;
      const isModalityHighlighted = modalityHighlightedSigns?.has(arc.sign) ?? false;

      let style = { stroke: 'rgba(255, 255, 255, 0.12)', strokeWidth: 1, dashArray: '3,6' };

      if (isCompatSelected) {
        style = { stroke: '#fbbf24', strokeWidth: 2.5, dashArray: 'none' };
      } else if (isAspectHighlighted && selectedAspect) {
        style = { stroke: ASPECT_DEFINITIONS[selectedAspect].color, strokeWidth: 2.5, dashArray: 'none' };
      } else if (isElementHighlighted) {
        style = { stroke: ELEMENT_CONFIG[arc.element]?.color || '#fbbf24', strokeWidth: 2.5, dashArray: 'none' };
      } else if (isModalityHighlighted) {
        style = { stroke: '#fbbf24', strokeWidth: 2.5, dashArray: 'none' };
      }

      spokesGroup.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', Math.cos(midAngle) * signInnerRadius)
        .attr('y2', Math.sin(midAngle) * signInnerRadius)
        .attr('stroke', style.stroke)
        .attr('stroke-width', style.strokeWidth)
        .attr('stroke-dasharray', style.dashArray);
    });

    // =========================================================================
    // ARC GENERATORS
    // =========================================================================
    const createArcGen = (inner: number, outer: number) =>
      d3.arc<D3SignArc>()
        .innerRadius(inner).outerRadius(outer)
        .startAngle(d => d.startAngle).endAngle(d => d.endAngle)
        .padAngle(0.01).cornerRadius(2);

    const seasonArcGen = d3.arc<D3SeasonArc>()
      .innerRadius(seasonInnerRadius).outerRadius(seasonOuterRadius)
      .startAngle(d => d.startAngle).endAngle(d => d.endAngle)
      .padAngle(0.02).cornerRadius(3);

    const signArcGen = createArcGen(signInnerRadius, signOuterRadius);
    const elementArcGen = createArcGen(elementInnerRadius, elementOuterRadius);
    const modalityArcGen = createArcGen(modalityInnerRadius, modalityOuterRadius);

    // =========================================================================
    // ELEMENT RING
    // =========================================================================
    const elementGroup = g.append('g').attr('class', 'element-ring')
      .style('opacity', getModeOpacity('element'));

    elementGroup.selectAll('path')
      .data(signArcs)
      .join('path')
      .attr('d', elementArcGen)
      .attr('fill', d => ELEMENT_CONFIG[d.element]?.color || '#6b7280')
      .attr('opacity', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return getElementRingOpacity(d, constraints, highlightedElement, highlightedModality, selectedSeason, selectedSign, selectedSignElement);
      })
      .attr('stroke', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        const highlighted = isSegmentHighlighted(d, 'element', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignElement);
        return highlighted ? HIGHLIGHT_STROKE : DEFAULT_STROKE;
      })
      .attr('stroke-width', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return isSegmentHighlighted(d, 'element', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignElement) ? 3 : 1;
      })
      .style('filter', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return isSegmentHighlighted(d, 'element', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignElement) ? HIGHLIGHT_GLOW : 'none';
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(150).attr('opacity', 1);
        onHoverElement(d.element);
      })
      .on('mouseout', function(event, d) {
        const constraints = checkConstraints(makeConstraintParams(d));
        const opacity = getElementRingOpacity(d, constraints, highlightedElement, highlightedModality, selectedSeason, selectedSign, selectedSignElement);
        d3.select(this).transition().duration(150).attr('opacity', opacity);
        onHoverElement(null);
      });

    // Element labels
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (elementInnerRadius + elementOuterRadius) / 2;
      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      elementGroup.append('text')
        .attr('x', Math.cos(midAngle) * labelR)
        .attr('y', Math.sin(midAngle) * labelR)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${Math.cos(midAngle) * labelR}, ${Math.sin(midAngle) * labelR})`)
        .style('font-size', '8px').style('font-weight', '700').style('fill', '#fff')
        .style('letter-spacing', '0.5px').style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
        .style('pointer-events', 'none')
        .text(ELEMENT_CONFIG[arc.element]?.label || '');
    });

    // Element mode highlight borders
    if (wheelMode === 'elements') {
      [elementInnerRadius, elementOuterRadius].forEach(r => {
        g.append('circle').attr('r', r).attr('fill', 'none')
          .attr('stroke', '#fbbf24').attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
      });
    }

    // =========================================================================
    // MODALITY RING
    // =========================================================================
    const modalityGroup = g.append('g').attr('class', 'modality-ring')
      .style('opacity', getModeOpacity('modality'));

    modalityGroup.selectAll('path')
      .data(signArcs)
      .join('path')
      .attr('d', modalityArcGen)
      .attr('fill', d => MODALITY_CONFIG[d.modality]?.color || '#6b7280')
      .attr('opacity', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return getModalityRingOpacity(d, constraints, highlightedModality, highlightedElement, selectedSeason, selectedSign, selectedSignModality);
      })
      .attr('stroke', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        const highlighted = isSegmentHighlighted(d, 'modality', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignModality);
        return highlighted ? HIGHLIGHT_STROKE : DEFAULT_STROKE;
      })
      .attr('stroke-width', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return isSegmentHighlighted(d, 'modality', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignModality) ? 3 : 1;
      })
      .style('filter', d => {
        const constraints = checkConstraints(makeConstraintParams(d));
        return isSegmentHighlighted(d, 'modality', constraints, highlightedElement, highlightedModality, selectedSign, selectedSignModality) ? HIGHLIGHT_GLOW : 'none';
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(150).attr('opacity', 1);
        onHoverModality(d.modality);
      })
      .on('mouseout', function(event, d) {
        const constraints = checkConstraints(makeConstraintParams(d));
        const opacity = getModalityRingOpacity(d, constraints, highlightedModality, highlightedElement, selectedSeason, selectedSign, selectedSignModality);
        d3.select(this).transition().duration(150).attr('opacity', opacity);
        onHoverModality(null);
      });

    // Modality labels
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (modalityInnerRadius + modalityOuterRadius) / 2;
      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      modalityGroup.append('text')
        .attr('x', Math.cos(midAngle) * labelR)
        .attr('y', Math.sin(midAngle) * labelR)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${Math.cos(midAngle) * labelR}, ${Math.sin(midAngle) * labelR})`)
        .style('font-size', '7px').style('font-weight', '700').style('fill', '#fff')
        .style('letter-spacing', '0.3px').style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
        .style('pointer-events', 'none')
        .text(MODALITY_CONFIG[arc.modality]?.label || '');
    });

    // Modality mode highlight borders
    if (wheelMode === 'modality') {
      [modalityInnerRadius, modalityOuterRadius].forEach(r => {
        g.append('circle').attr('r', r).attr('fill', 'none')
          .attr('stroke', '#fbbf24').attr('stroke-width', 2)
          .style('filter', 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))');
      });
    }

    // =========================================================================
    // SEASON RING
    // =========================================================================
    const seasonGroup = g.append('g').attr('class', 'seasons-ring')
      .style('opacity', getModeOpacity('seasons'));

    seasonGroup.selectAll('path')
      .data(seasonArcs)
      .join('path')
      .attr('d', seasonArcGen)
      .attr('fill', d => d.color)
      .attr('stroke', d => {
        if (selectedSeason === d.season) return '#fbbf24';
        if (selectedSign) {
          const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
          if (signMeta && signMeta.season === d.season) return '#fbbf24';
        }
        return '#1e293b';
      })
      .attr('stroke-width', d => {
        if (selectedSeason === d.season) return 3;
        if (selectedSign) {
          const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
          if (signMeta && signMeta.season === d.season) return 3;
        }
        return 2;
      })
      .attr('opacity', d => {
        if (selectedSeason && selectedSeason !== d.season) return 0.3;
        if (selectedSign) {
          const signMeta = SIGN_METADATA.find(m => m.sign === selectedSign);
          if (signMeta && signMeta.season !== d.season) return 0.3;
        }
        return 1;
      })
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        if (selectedSeason) return;
        g.selectAll('.seasons-ring path').transition().duration(150)
          .attr('opacity', (arcData: typeof d) => arcData.season === d.season ? 1 : 0.4);
        g.selectAll('.signs-ring path').transition().duration(150)
          .attr('opacity', (signData: SignArcData) => {
            const meta = SIGN_METADATA.find(m => m.sign === signData.sign);
            return meta?.season === d.season ? 1 : 0.4;
          });
        d3.select(this).transition().duration(150)
          .attr('transform', function() {
            const [cx, cy] = seasonArcGen.centroid(d);
            const angle = Math.atan2(cy, cx);
            return `translate(${Math.cos(angle) * 5}, ${Math.sin(angle) * 5})`;
          });
      })
      .on('mouseout', function() {
        if (selectedSeason) return;
        g.selectAll('.seasons-ring path').transition().duration(150).attr('opacity', 1);
        g.selectAll('.signs-ring path').transition().duration(150).attr('opacity', 1);
        d3.select(this).transition().duration(150).attr('transform', 'translate(0, 0)');
      })
      .on('click', (event, d) => onSeasonClick(d.season));

    // Season phase labels
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const labelR = (seasonInnerRadius + seasonOuterRadius) / 2;
      const phaseLabel = MODALITY_CONFIG[arc.modality]?.phase || '';
      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      seasonGroup.append('text')
        .attr('x', Math.cos(midAngle) * labelR)
        .attr('y', Math.sin(midAngle) * labelR)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${Math.cos(midAngle) * labelR}, ${Math.sin(midAngle) * labelR})`)
        .style('font-size', phaseLabel === 'TRANSITION' ? '8px' : '9px')
        .style('font-weight', '700').style('fill', '#fff')
        .style('letter-spacing', '0.5px').style('text-shadow', '0 1px 3px rgba(0,0,0,0.7)')
        .style('pointer-events', 'none')
        .text(phaseLabel);
    });

    // =========================================================================
    // EXTERNAL SEASON LABELS
    // =========================================================================
    const labelRadius = totalRadius + 65;
    const seasonLabelGroup = g.append('g').attr('class', 'season-labels-external');

    seasonArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const pointerStart = seasonOuterRadius + 2;
      const pointerEnd = labelRadius - 8;
      const isSelected = selectedSeason === arc.season;
      const isDimmed = selectedSeason && selectedSeason !== arc.season;

      seasonLabelGroup.append('line')
        .attr('x1', Math.cos(midAngle) * pointerStart).attr('y1', Math.sin(midAngle) * pointerStart)
        .attr('x2', Math.cos(midAngle) * pointerEnd).attr('y2', Math.sin(midAngle) * pointerEnd)
        .attr('stroke', isSelected ? '#fbbf24' : arc.color)
        .attr('stroke-width', isSelected ? 2.5 : 1.5)
        .attr('opacity', isDimmed ? 0.3 : 0.6);

      seasonLabelGroup.append('circle')
        .attr('cx', Math.cos(midAngle) * pointerEnd).attr('cy', Math.sin(midAngle) * pointerEnd)
        .attr('r', isSelected ? 6 : 4)
        .attr('fill', isSelected ? '#fbbf24' : arc.color)
        .attr('opacity', isDimmed ? 0.3 : 1)
        .style('cursor', 'pointer')
        .on('click', () => onSeasonClick(arc.season));

      seasonLabelGroup.append('text')
        .attr('x', Math.cos(midAngle) * labelRadius).attr('y', Math.sin(midAngle) * labelRadius)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('font-size', isSelected ? '16px' : '14px')
        .style('font-weight', isSelected ? '700' : '600')
        .style('fill', isSelected ? '#fbbf24' : arc.color)
        .style('opacity', isDimmed ? 0.3 : 1)
        .style('cursor', 'pointer')
        .style('text-shadow', isSelected ? '0 0 10px rgba(251, 191, 36, 0.5)' : 'none')
        .on('click', () => onSeasonClick(arc.season))
        .text(`${arc.icon} ${arc.season}`);
    });

    // =========================================================================
    // ANIMATED PULSE
    // =========================================================================
    const flowPulseGroup = g.append('g').attr('class', 'flow-pulse-container');
    const pulseRadius = seasonOuterRadius + 4;

    const pulseArc = d3.arc<{ startAngle: number; color: string }>()
      .innerRadius(pulseRadius).outerRadius(pulseRadius + 6)
      .startAngle((d) => d.startAngle)
      .endAngle((d) => d.startAngle + Math.PI / 6);

    const pulses = flowPulseGroup.selectAll('.flow-pulse-segment')
      .data(SEASON_PULSE_COLORS)
      .join('path')
      .attr('d', pulseArc)
      .attr('fill', d => d.color)
      .attr('opacity', 0.6)
      .style('filter', 'blur(1px) drop-shadow(0 0 4px currentColor)')
      .style('pointer-events', 'none');

    let startTime: number | null = null;
    const animatePulse = (elapsed: number) => {
      if (startTime === null) startTime = elapsed;
      const progress = ((elapsed - startTime) % 20000) / 20000;
      flowPulseGroup.attr('transform', `rotate(${progress * 360})`);
      pulses.attr('opacity', 0.4 + 0.4 * Math.sin(elapsed / 1000));
    };

    const pulseTimer = d3.timer(animatePulse);
    (window as any).__pulseTimer = pulseTimer;

    // =========================================================================
    // CELESTIAL EVENTS (Equinox/Solstice markers)
    // =========================================================================
    const celestialGroup = g.append('g').attr('class', 'celestial-events');
    const celestialRadius = seasonOuterRadius + 40;

    CELESTIAL_EVENTS.forEach(event => {
      const angleRad = (event.angle - 90) * Math.PI / 180;
      const markerX = Math.cos(angleRad) * celestialRadius;
      const markerY = Math.sin(angleRad) * celestialRadius;
      const diamondSize = 8;

      celestialGroup.append('path')
        .attr('d', `M ${markerX} ${markerY - diamondSize} L ${markerX + diamondSize} ${markerY} L ${markerX} ${markerY + diamondSize} L ${markerX - diamondSize} ${markerY} Z`)
        .attr('fill', event.color).attr('stroke', '#fff').attr('stroke-width', 1.5)
        .attr('opacity', 0.9).style('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))')
        .on('mouseover', function() {
          d3.select(this).transition().duration(150).attr('opacity', 1)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))');
          onHoverCelestialEvent(event.id);
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(150).attr('opacity', 0.9)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))');
          onHoverCelestialEvent(null);
        });

      // Label positioning
      const labelOffset = 20;
      let textAnchor = 'middle', dy = 0;
      let labelX = markerX, labelY = markerY;
      if (event.angle === 0) { labelY -= labelOffset; dy = -2; }
      else if (event.angle === 90) { labelX += labelOffset; textAnchor = 'start'; }
      else if (event.angle === 180) { labelY += labelOffset; dy = 4; }
      else if (event.angle === 270) { labelX -= labelOffset; textAnchor = 'end'; }

      celestialGroup.append('text')
        .attr('x', labelX).attr('y', labelY).attr('dy', dy)
        .attr('text-anchor', textAnchor).attr('dominant-baseline', 'middle')
        .style('font-size', '9px').style('font-weight', '600').style('fill', event.color)
        .style('text-shadow', '0 1px 2px rgba(0,0,0,0.8)').style('pointer-events', 'none')
        .text(event.label);
    });

    // Store for tooltip components
    (window as any).__celestialEvents = CELESTIAL_EVENTS;
    (window as any).__signTooltips = SIGN_TOOLTIPS;
    (window as any).__elementTooltips = ELEMENT_TOOLTIPS;
    (window as any).__modalityTooltips = MODALITY_TOOLTIPS;

    // =========================================================================
    // FLOW ARROWS
    // =========================================================================
    const arrowRadius = seasonOuterRadius + 20;
    const arrowGroup = g.append('g').attr('class', 'season-flow-arrows');

    const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
    defs.selectAll('#season-arrow').remove();
    defs.append('marker')
      .attr('id', 'season-arrow').attr('viewBox', '0 0 10 10')
      .attr('refX', 8).attr('refY', 5).attr('markerWidth', 8).attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', 'rgba(255, 255, 255, 0.6)');

    [{ start: -70, end: 40 }, { start: 20, end: 130 }, { start: 110, end: 220 }, { start: 200, end: 310 }]
      .forEach(({ start, end }) => {
        const startRad = (start - 90) * Math.PI / 180;
        const endRad = (end - 90) * Math.PI / 180;
        arrowGroup.append('path')
          .attr('d', `M ${Math.cos(startRad) * arrowRadius} ${Math.sin(startRad) * arrowRadius} A ${arrowRadius} ${arrowRadius} 0 0 1 ${Math.cos(endRad) * arrowRadius} ${Math.sin(endRad) * arrowRadius}`)
          .attr('fill', 'none').attr('stroke', 'rgba(255, 255, 255, 0.35)')
          .attr('stroke-width', 2.5).attr('stroke-dasharray', '10,5')
          .attr('marker-end', 'url(#season-arrow)');
      });

    // =========================================================================
    // SIGNS RING (Main feature)
    // =========================================================================
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
        if (isElementHighlighted) return ELEMENT_CONFIG[d.element]?.color || '#fbbf24';
        if (isModalityHighlighted) return MODALITY_CONFIG[d.modality]?.color || '#fbbf24';
        return '#1e293b';
      })
      .attr('stroke-width', d => {
        const isElementHighlighted = elementHighlightedSigns?.has(d.sign) ?? false;
        const isModalityHighlighted = modalityHighlightedSigns?.has(d.sign) ?? false;
        return (isSignSelected(d.sign) || d.sign === selectedSign || d.sign === aspectReferenceSign || isElementHighlighted || isModalityHighlighted) ? 3 : 1.5;
      })
      .attr('opacity', d => getSignRingOpacity(d, selectedSign, selectedSeason, highlightedElement, highlightedModality, elementHighlightedSigns, modalityHighlightedSigns))
      .style('cursor', 'pointer')
      .style('pointer-events', 'visiblePainted')
      .on('mouseover', function(event, d) {
        g.selectAll('.signs-ring path').transition().duration(150)
          .attr('opacity', (signData: SignArcData) => signData.sign === d.sign ? 1 : 0.4);
        g.selectAll('.seasons-ring path').transition().duration(150).attr('opacity', 0.4);
        d3.select(this).transition().duration(150)
          .attr('transform', function() {
            const [cx, cy] = signArcGen.centroid(d);
            const angle = Math.atan2(cy, cx);
            return `translate(${Math.cos(angle) * 4}, ${Math.sin(angle) * 4})`;
          });
        onHoverSign(d.sign);
      })
      .on('mouseout', function() {
        g.selectAll('.signs-ring path').transition().duration(150)
          .attr('opacity', (signData: SignArcData) =>
            getSignRingOpacity(signData, selectedSign, selectedSeason, highlightedElement, highlightedModality, elementHighlightedSigns, modalityHighlightedSigns));
        g.selectAll('.seasons-ring path').transition().duration(150)
          .attr('opacity', (seasonData: D3SeasonArc) => {
            if (selectedSeason && selectedSeason !== seasonData.season) return 0.3;
            if (selectedSign) {
              const meta = SIGN_METADATA.find(m => m.sign === selectedSign);
              if (meta && meta.season !== seasonData.season) return 0.3;
            }
            return 1;
          });
        d3.select(this).transition().duration(150).attr('transform', 'translate(0, 0)');
        onHoverSign(null);
      })
      .on('click', function(event, d) {
        event.stopPropagation();
        onSignClick(d.sign);
      });

    // Sign symbols, names, and planetary rulers
    signArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const isSelected = isSignSelected(arc.sign) || arc.sign === selectedSign;
      const rulerRadius = signInnerRadius + (signOuterRadius - signInnerRadius) * 0.22;
      const symbolRadius = signInnerRadius + (signOuterRadius - signInnerRadius) * 0.58;
      const nameRadius = signInnerRadius + (signOuterRadius - signInnerRadius) * 0.82;

      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      // Planet ruler glyph (inner) with background box and tooltip
      const ruler = SIGN_RULERS[arc.sign];
      if (ruler) {
        const rx = Math.cos(midAngle) * rulerRadius;
        const ry = Math.sin(midAngle) * rulerRadius;
        const boxSize = isSelected ? 28 : 26;
        const planetColor = PLANET_COLORS[ruler.planet] || '#94a3b8';

        const rulerGroup = signGroup.append('g')
          .style('pointer-events', 'all')
          .style('cursor', onPlanetClick ? 'pointer' : 'default')
          .on('click', function(event) {
            event.stopPropagation();
            onPlanetClick?.(ruler.planet);
          });

        rulerGroup.append('rect')
          .attr('x', rx - boxSize / 2).attr('y', ry - boxSize / 2)
          .attr('width', boxSize).attr('height', boxSize)
          .attr('rx', 5).attr('ry', 5)
          .attr('fill', isSelected ? 'rgba(251, 191, 36, 0.2)' : `${planetColor}40`)
          .attr('stroke', isSelected ? '#fbbf24' : planetColor)
          .attr('stroke-width', isSelected ? 2 : 1.5);

        rulerGroup.append('text')
          .attr('x', rx).attr('y', ry)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'central')
          .style('font-size', isSelected ? '19px' : '17px')
          .style('fill', isSelected ? '#fbbf24' : '#fff')
          .style('font-weight', '700')
          .style('text-shadow', `0 0 6px ${planetColor}`)
          .text(ruler.glyph);

        rulerGroup.append('title').text(`${ruler.planet} rules ${arc.sign}`);
      }

      // Zodiac sign glyph (middle, closer to name)
      signGroup.append('text')
        .attr('x', Math.cos(midAngle) * symbolRadius).attr('y', Math.sin(midAngle) * symbolRadius)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .style('font-size', isSelected ? '22px' : '18px')
        .style('fill', isSelected ? '#fbbf24' : '#fff')
        .style('font-weight', '700')
        .style('pointer-events', 'none')
        .text(arc.symbol);

      // Sign name (outer)
      signGroup.append('text')
        .attr('x', Math.cos(midAngle) * nameRadius).attr('y', Math.sin(midAngle) * nameRadius)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('transform', `rotate(${rotation}, ${Math.cos(midAngle) * nameRadius}, ${Math.sin(midAngle) * nameRadius})`)
        .style('font-size', '9px').style('font-weight', '700')
        .style('fill', isSelected ? '#fbbf24' : '#fff')
        .style('letter-spacing', '0.5px').style('pointer-events', 'none')
        .text(arc.sign.toUpperCase());

      if (isSelected) {
        const selectionRadius = signOuterRadius + 18;
        signGroup.append('text')
          .attr('x', Math.cos(midAngle) * selectionRadius).attr('y', Math.sin(midAngle) * selectionRadius)
          .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
          .style('font-size', '11px').style('font-weight', '700').style('fill', '#fbbf24')
          .style('pointer-events', 'none')
          .text(getSignSelectionLabel(arc.sign));
      }
    });

    // Cleanup
    return () => {
      if ((window as any).__pulseTimer) {
        (window as any).__pulseTimer.stop();
        (window as any).__pulseTimer = null;
      }
    };

  }, [
    dimensions, seasonArcs, signArcs, viewMode, selectedSign, signA, signB,
    selectedAspect, aspectHighlightedSigns, aspectReferenceSign,
    elementHighlightedSigns, highlightedElement, modalityHighlightedSigns, highlightedModality,
    selectedSeason, onSignClick, onSeasonClick, onHoverSign, onHoverElement,
    onHoverModality, onHoverCelestialEvent, onHoverAspect, onPlanetClick, wheelMode,
  ]);

  return <svg ref={svgRef} />;
};

export default TropicalZodiacWheel;
