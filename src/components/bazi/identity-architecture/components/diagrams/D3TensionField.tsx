/**
 * D3TensionField — arrow vectors showing direction of internal conflict
 *
 * Each pillar gets an arrow from center, pointing in the direction
 * its elemental tension pulls, with length proportional to magnitude.
 */

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { TensionVector } from '../../engine/tensionVectors';
import { ELEMENT_COLORS } from '../../utils/elementTheme';

interface Props {
  vectors: TensionVector[];
  severity: number; // 0-1, drives arrow pulse intensity
}

export const D3TensionField: React.FC<Props> = ({ vectors, severity }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = 260, h = 260;
    const cx = w / 2, cy = h / 2;
    const maxLen = 90;

    // Defs: arrowhead marker per element
    const defs = svg.append('defs');
    const uniqueElements = [...new Set(vectors.map(v => v.element))];
    uniqueElements.forEach(el => {
      defs.append('marker')
        .attr('id', `arrow-${el}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L10,0L0,4Z')
        .attr('fill', ELEMENT_COLORS[el] || '#f87171');
    });

    // Glow filter
    const glow = defs.append('filter')
      .attr('id', 'vectorGlow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    glow.append('feGaussianBlur')
      .attr('in', 'SourceGraphic')
      .attr('stdDeviation', 2 + severity * 3)
      .attr('result', 'blur');
    glow.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

    const root = svg.append('g').attr('transform', `translate(${cx},${cy})`);

    // Center dot
    root.append('circle')
      .attr('r', 4)
      .attr('fill', '#334155')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);

    // Draw each vector arrow
    vectors.forEach((v, i) => {
      const len = maxLen * v.magnitude;
      if (len < 5) return; // skip negligible vectors

      const rad = (v.angleDeg - 90) * (Math.PI / 180);
      const x2 = len * Math.cos(rad);
      const y2 = len * Math.sin(rad);
      const color = ELEMENT_COLORS[v.element] || '#f87171';

      // Arrow line
      const line = root.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', color)
        .attr('stroke-width', 1.5 + v.magnitude * 2)
        .attr('stroke-opacity', 0.4 + v.magnitude * 0.5)
        .attr('marker-end', `url(#arrow-${v.element})`)
        .attr('filter', 'url(#vectorGlow)');

      // Pulse animation (staggered)
      function pulseArrow() {
        const speed = 2000 - severity * 800;
        line
          .transition('arrowPulse')
          .duration(speed / 2)
          .ease(d3.easeSinInOut)
          .attr('stroke-opacity', 0.7 + v.magnitude * 0.3)
          .attr('stroke-width', 2 + v.magnitude * 2.5)
          .transition('arrowPulse')
          .duration(speed / 2)
          .ease(d3.easeSinInOut)
          .attr('stroke-opacity', 0.3 + v.magnitude * 0.2)
          .attr('stroke-width', 1.5 + v.magnitude * 1.5)
          .on('end', pulseArrow);
      }
      d3.timeout(pulseArrow, i * 350);

      // Role label at arrow tip
      const labelR = len + 14;
      const lx = labelR * Math.cos(rad);
      const ly = labelR * Math.sin(rad);
      root.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', 9)
        .attr('font-weight', 600)
        .attr('fill', color)
        .attr('opacity', 0.8)
        .text(v.role[0]); // Y M D H
    });

    // Center label
    root.append('text')
      .attr('y', -14)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#64748b')
      .text('Tension');
    root.append('text')
      .attr('y', -4)
      .attr('text-anchor', 'middle')
      .attr('font-size', 9)
      .attr('fill', '#64748b')
      .text('Field');

  }, [vectors, severity]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg ref={svgRef} viewBox="0 0 260 260"
        style={{ width: 240, height: 240 }}
      />
      <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>
        Arrow length = conflict intensity · Direction = elemental pull
      </div>
    </div>
  );
};
