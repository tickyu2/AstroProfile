/**
 * Unified D3 Layer Manager
 *
 * Manages all 8 wheel layers with:
 * - Toggle on/off capability
 * - Mode-responsive rendering
 * - Smooth transitions
 * - Z-index ordering
 */

import * as d3 from 'd3';
import { LayerConfig, LayerName, WheelMode, RenderConfig, MODE_VISUALS } from '../types/wheelModes';

export class LayerManager {
  private layers: Map<LayerName, LayerConfig>;
  private rootGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;

  constructor() {
    this.layers = new Map();
    this.initializeLayers();
  }

  private initializeLayers() {
    // Layer 8 (Outermost)
    this.layers.set('months', {
      name: 'months',
      enabled: true,
      zIndex: 8,
      render: this.renderMonths.bind(this)
    });

    this.layers.set('retrograde', {
      name: 'retrograde',
      enabled: true,
      zIndex: 8,
      render: this.renderRetrograde.bind(this)
    });

    // Layer 7
    this.layers.set('season', {
      name: 'season',
      enabled: true,
      zIndex: 7,
      render: this.renderSeason.bind(this)
    });

    // Layer 6
    this.layers.set('modality', {
      name: 'modality',
      enabled: true,
      zIndex: 6,
      render: this.renderModality.bind(this)
    });

    // Layer 5
    this.layers.set('element', {
      name: 'element',
      enabled: true,
      zIndex: 5,
      render: this.renderElement.bind(this)
    });

    // Layer 4
    this.layers.set('signs', {
      name: 'signs',
      enabled: true,
      zIndex: 4,
      render: this.renderSigns.bind(this)
    });

    // Layer 3
    this.layers.set('decans', {
      name: 'decans',
      enabled: true,
      zIndex: 3,
      render: this.renderDecans.bind(this)
    });

    // Layer 2
    this.layers.set('planets', {
      name: 'planets',
      enabled: true,
      zIndex: 2,
      render: this.renderPlanets.bind(this)
    });

    // Layer 1 (Innermost)
    this.layers.set('center', {
      name: 'center',
      enabled: true,
      zIndex: 1,
      render: this.renderCenter.bind(this)
    });
  }

  public toggleLayer(layerName: LayerName) {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer.enabled = !layer.enabled;
    }
  }

  public enableLayer(layerName: LayerName) {
    const layer = this.layers.get(layerName);
    if (layer) layer.enabled = true;
  }

  public disableLayer(layerName: LayerName) {
    const layer = this.layers.get(layerName);
    if (layer) layer.enabled = false;
  }

  public isLayerEnabled(layerName: LayerName): boolean {
    return this.layers.get(layerName)?.enabled ?? false;
  }

  public getEnabledLayers(): LayerName[] {
    return Array.from(this.layers.values())
      .filter(layer => layer.enabled)
      .map(layer => layer.name);
  }

  public renderAll(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    config: RenderConfig
  ) {
    // Clear previous render
    svg.selectAll('*').remove();

    // Create root group
    this.rootGroup = svg
      .append('g')
      .attr('transform', `translate(${config.centerX}, ${config.centerY})`);

    // Sort layers by z-index (outermost first for proper stacking)
    const sortedLayers = Array.from(this.layers.values())
      .filter(layer => layer.enabled)
      .sort((a, b) => b.zIndex - a.zIndex);

    // Render each layer
    sortedLayers.forEach(layer => {
      const layerGroup = this.rootGroup!
        .append('g')
        .attr('class', `layer-${layer.name}`)
        .attr('data-z-index', layer.zIndex);

      layer.render(layerGroup, config.mode, config);
    });
  }

  public transition(
    from: WheelMode,
    to: WheelMode,
    duration: number = 600
  ) {
    if (!this.rootGroup) return;

    const easing = d3.easeCubicOut;

    // Apply mode-specific visual transitions
    const toVisuals = MODE_VISUALS[to];

    // Season ring opacity
    this.rootGroup.selectAll('.layer-season')
      .transition()
      .duration(duration)
      .ease(easing)
      .attr('opacity', toVisuals.seasonRingOpacity);

    // Modality ring opacity
    this.rootGroup.selectAll('.layer-modality')
      .transition()
      .duration(duration)
      .ease(easing)
      .attr('opacity', toVisuals.modalityRingOpacity);

    // Element ring opacity
    this.rootGroup.selectAll('.layer-element')
      .transition()
      .duration(duration)
      .ease(easing)
      .attr('opacity', toVisuals.elementRingOpacity);

    // Sign-specific transitions handled in renderSigns
  }

  // =========================================================================
  // LAYER RENDER FUNCTIONS
  // =========================================================================

  private renderMonths(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Month tick marks on outermost radius
    const monthRadius = config.baseRadius + 30;
    const monthsPerYear = 12;

    for (let i = 0; i < monthsPerYear; i++) {
      const angle = (i / monthsPerYear) * 2 * Math.PI - Math.PI / 2;
      const x1 = Math.cos(angle) * monthRadius;
      const y1 = Math.sin(angle) * monthRadius;
      const x2 = Math.cos(angle) * (monthRadius + 10);
      const y2 = Math.sin(angle) * (monthRadius + 10);

      g.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', '#6496ff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5);
    }
  }

  private renderRetrograde(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Retrograde arcs for planets
    if (!config.planetPositions) return;

    const retrogradeRadius = config.baseRadius + 45;

    config.planetPositions
      .filter(p => p.retrograde)
      .forEach(planet => {
        const startAngle = (planet.degree - 5) * Math.PI / 180 - Math.PI / 2;
        const endAngle = (planet.degree + 5) * Math.PI / 180 - Math.PI / 2;

        const arc = d3.arc()
          .innerRadius(retrogradeRadius - 3)
          .outerRadius(retrogradeRadius + 3)
          .startAngle(startAngle)
          .endAngle(endAngle);

        g.append('path')
          .attr('d', arc as any)
          .attr('fill', '#ff6b6b')
          .attr('opacity', 0.7);
      });
  }

  private renderSeason(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Season ring rendering
    const visuals = MODE_VISUALS[mode];
    const radiusAdjust = visuals.radiusAdjustment('season');
    const opacity = visuals.seasonRingOpacity;

    // Season colors and angles
    const seasons = [
      { name: 'Spring', color: '#90EE90', startDeg: 0, endDeg: 90 },
      { name: 'Summer', color: '#FFD700', startDeg: 90, endDeg: 180 },
      { name: 'Autumn', color: '#FF8C00', startDeg: 180, endDeg: 270 },
      { name: 'Winter', color: '#4169E1', startDeg: 270, endDeg: 360 }
    ];

    const innerRadius = config.baseRadius * 0.7 + radiusAdjust;
    const outerRadius = config.baseRadius + radiusAdjust;

    seasons.forEach(season => {
      const startAngle = (season.startDeg * Math.PI / 180) - Math.PI / 2;
      const endAngle = (season.endDeg * Math.PI / 180) - Math.PI / 2;

      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);

      g.append('path')
        .attr('d', arc as any)
        .attr('fill', season.color)
        .attr('stroke', '#1a1a2e')
        .attr('stroke-width', 1)
        .attr('opacity', opacity);
    });
  }

  private renderModality(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Modality ring rendering
    const visuals = MODE_VISUALS[mode];
    const opacity = visuals.modalityRingOpacity;

    const modalities = [
      { name: 'Cardinal', color: '#FF6B6B' },
      { name: 'Fixed', color: '#4ECDC4' },
      { name: 'Mutable', color: '#95E1D3' }
    ];

    const innerRadius = config.baseRadius * 0.4;
    const outerRadius = config.baseRadius * 0.7;

    // Each modality appears 4 times (one per season)
    for (let i = 0; i < 12; i++) {
      const modalityIndex = i % 3;
      const startAngle = (i * 30 * Math.PI / 180) - Math.PI / 2;
      const endAngle = ((i + 1) * 30 * Math.PI / 180) - Math.PI / 2;

      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);

      g.append('path')
        .attr('d', arc as any)
        .attr('fill', modalities[modalityIndex].color)
        .attr('stroke', '#1a1a2e')
        .attr('stroke-width', 1)
        .attr('opacity', opacity);
    }
  }

  private renderElement(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Element ring rendering + sign glyphs
    const visuals = MODE_VISUALS[mode];
    const opacity = visuals.elementRingOpacity;

    const elements: Record<number, { name: string; color: string }> = {
      0: { name: 'Fire', color: '#FF4500' },    // Aries
      1: { name: 'Earth', color: '#8B4513' },   // Taurus
      2: { name: 'Air', color: '#87CEEB' },     // Gemini
      3: { name: 'Water', color: '#4682B4' },   // Cancer
      4: { name: 'Fire', color: '#FF4500' },    // Leo
      5: { name: 'Earth', color: '#8B4513' },   // Virgo
      6: { name: 'Air', color: '#87CEEB' },     // Libra
      7: { name: 'Water', color: '#4682B4' },   // Scorpio
      8: { name: 'Fire', color: '#FF4500' },    // Sagittarius
      9: { name: 'Earth', color: '#8B4513' },   // Capricorn
      10: { name: 'Air', color: '#87CEEB' },    // Aquarius
      11: { name: 'Water', color: '#4682B4' }   // Pisces
    };

    const innerRadius = config.baseRadius * 0.1;
    const outerRadius = config.baseRadius * 0.4;

    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 * Math.PI / 180) - Math.PI / 2;
      const endAngle = ((i + 1) * 30 * Math.PI / 180) - Math.PI / 2;

      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(endAngle);

      g.append('path')
        .attr('d', arc as any)
        .attr('fill', elements[i].color)
        .attr('stroke', '#1a1a2e')
        .attr('stroke-width', 1)
        .attr('opacity', opacity);
    }
  }

  private renderSigns(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Sign labels with mode-specific opacity
    const visuals = MODE_VISUALS[mode];
    const signs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
    const signNames = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                       'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const labelRadius = config.baseRadius * 0.85;

    signs.forEach((symbol, i) => {
      const angle = ((i * 30 + 15) * Math.PI / 180) - Math.PI / 2;
      const x = Math.cos(angle) * labelRadius;
      const y = Math.sin(angle) * labelRadius;
      const opacity = visuals.signOpacity(signNames[i]);

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#fff')
        .attr('opacity', opacity)
        .text(symbol);
    });
  }

  private renderDecans(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Decan/zone overlays (especially for Taurus in taurus mode)
    if (mode === 'taurus' && config.activeSign === 'Taurus') {
      // Render Taurus decan bands at 10° intervals
      const taurusStart = 30; // Taurus starts at 30°
      const innerRadius = config.baseRadius * 0.7;
      const outerRadius = config.baseRadius;

      for (let decan = 0; decan < 3; decan++) {
        const startDeg = taurusStart + (decan * 10);
        const endDeg = startDeg + 10;
        const startAngle = (startDeg * Math.PI / 180) - Math.PI / 2;
        const endAngle = (endDeg * Math.PI / 180) - Math.PI / 2;

        const arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle);

        g.append('path')
          .attr('d', arc as any)
          .attr('fill', 'none')
          .attr('stroke', '#ffd700')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.6);
      }
    }
  }

  private renderPlanets(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Planet markers + aspect lines
    if (!config.planetPositions) return;

    config.planetPositions.forEach(planet => {
      const angle = planet.degree * Math.PI / 180 - Math.PI / 2;
      const radius = config.baseRadius * 0.25;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Animate glyph in planet mode
      const scale = mode === 'planet' ? 1.2 : 1;

      g.append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', `${16 * scale}px`)
        .attr('fill', '#ffd700')
        .text(planet.symbol);
    });
  }

  private renderCenter(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    mode: WheelMode,
    config: RenderConfig
  ) {
    // Central pointer + degree readout
    if (config.activeDegree !== undefined) {
      const angle = config.activeDegree * Math.PI / 180 - Math.PI / 2;
      const radius = config.baseRadius * 0.15;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', Math.cos(angle) * radius)
        .attr('y2', Math.sin(angle) * radius)
        .attr('stroke', '#ffd700')
        .attr('stroke-width', 2);

      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', '#ffd700');
    }

    // Center text
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6496ff')
      .attr('opacity', 0.8)
      .text('☉');
  }
}

// Singleton instance for global access
export const layerManager = new LayerManager();
