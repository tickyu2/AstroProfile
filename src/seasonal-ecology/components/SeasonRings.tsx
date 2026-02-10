/**
 * Season Rings D3 Component
 *
 * Complete 12-sign zodiac wheel with:
 * - Three concentric rings (Season/Modality/Element)
 * - Interactive hover tooltips
 * - Click-to-select functionality
 * - Animated transitions
 * - Degree-based highlighting
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { FullZodiacRingLayout, RingSegment } from '../types/seasonalEcology';
import './SeasonRings.css';

interface SeasonRingsProps {
  layout: FullZodiacRingLayout;
  width?: number;
  height?: number;
  highlightSign?: string;
  highlightDegree?: number;
  onSelectDegree?: (sign: string, degree: number) => void;
}

interface TooltipData {
  x: number;
  y: number;
  label: string;
  ring: string;
  sign?: string;
  code?: string;
}

export const SeasonRings: React.FC<SeasonRingsProps> = ({
  layout,
  width = 600,
  height = 600,
  highlightSign,
  highlightDegree,
  onSelectDegree
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) / 2 - 40;

    // Ring radii
    const seasonInnerRadius = outerRadius * 0.7;
    const seasonOuterRadius = outerRadius;

    const modalityInnerRadius = outerRadius * 0.4;
    const modalityOuterRadius = outerRadius * 0.7;

    const elementInnerRadius = outerRadius * 0.1;
    const elementOuterRadius = outerRadius * 0.4;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${centerX}, ${centerY})`);

    // Render each segment with animations
    layout.segments.forEach((segment, segmentIndex) => {
      const arc = d3.arc<RingSegment>()
        .innerRadius(
          segment.ring === 'season' ? seasonInnerRadius :
          segment.ring === 'modality' ? modalityInnerRadius :
          elementInnerRadius
        )
        .outerRadius(
          segment.ring === 'season' ? seasonOuterRadius :
          segment.ring === 'modality' ? modalityOuterRadius :
          elementOuterRadius
        )
        .startAngle(segment.startAngle)
        .endAngle(segment.endAngle);

      // Check if segment should be highlighted
      const isHighlighted = highlightSign && segment.sign === highlightSign;

      const path = g.append('path')
        .datum(segment)
        .attr('fill', isHighlighted ? '#ffd54f' : segment.color)
        .attr('stroke', isHighlighted ? '#ffb300' : '#1a1a2e')
        .attr('stroke-width', isHighlighted ? 2.5 : 1.5)
        .attr('opacity', 0)
        .style('cursor', segment.sign ? 'pointer' : 'default')
        .style('transition', 'all 0.3s ease');

      // Animated entrance
      path
        .transition()
        .duration(600)
        .delay(segmentIndex * 15)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1)
        .attrTween('d', function() {
          const interpolate = d3.interpolate(segment.startAngle, segment.endAngle);
          return function(t: number) {
            const tempArc = d3.arc<RingSegment>()
              .innerRadius(arc.innerRadius()() as number)
              .outerRadius(arc.outerRadius()() as number)
              .startAngle(segment.startAngle)
              .endAngle(interpolate(t));
            return tempArc(segment) || '';
          };
        });

      // Interactive events
      path
        .on('mousemove', (event: MouseEvent) => {
          const [x, y] = d3.pointer(event, svgRef.current);
          setTooltip({
            x,
            y,
            label: segment.label,
            ring: segment.ring,
            sign: segment.sign,
            code: segment.code
          });

          // Hover animation
          d3.select(event.currentTarget as Element)
            .transition()
            .duration(150)
            .attr('opacity', 0.85)
            .attr('stroke-width', 3);
        })
        .on('mouseleave', (event) => {
          setTooltip(null);

          d3.select(event.currentTarget as Element)
            .transition()
            .duration(150)
            .attr('opacity', 1)
            .attr('stroke-width', isHighlighted ? 2.5 : 1.5);
        })
        .on('click', () => {
          if (segment.sign && onSelectDegree) {
            // Calculate middle degree of this segment
            const segmentMidAngle = (segment.startAngle + segment.endAngle) / 2;
            const absoluteDegree = (segmentMidAngle * 180 / Math.PI) % 360;
            const degreeInSign = absoluteDegree % 30;

            onSelectDegree(segment.sign, degreeInSign);
          }
        });

      // Add labels for season ring signs
      if (segment.ring === 'season') {
        const angle = (segment.startAngle + segment.endAngle) / 2;
        const labelRadius = (seasonInnerRadius + seasonOuterRadius) / 2;
        const x = Math.cos(angle - Math.PI / 2) * labelRadius;
        const y = Math.sin(angle - Math.PI / 2) * labelRadius;

        g.append('text')
          .attr('x', x)
          .attr('y', y)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('fill', '#fff')
          .attr('opacity', 0)
          .attr('pointer-events', 'none')
          .text(segment.meta?.symbol as string || '')
          .transition()
          .delay(800)
          .duration(400)
          .attr('opacity', 1);
      }
    });

    // Center label with animation
    const centerText = g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#6496ff')
      .attr('opacity', 0)
      .text('Tropical Zodiac');

    centerText
      .transition()
      .delay(1000)
      .duration(600)
      .attr('opacity', 1);

  }, [layout, width, height, highlightSign, highlightDegree, onSelectDegree]);

  return (
    <div className="season-rings-container">
      <svg ref={svgRef} className="season-rings-svg" />

      {tooltip && (
        <div
          className="season-rings-tooltip"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 10
          }}
        >
          <div className="tooltip-header">
            <strong>{tooltip.sign || tooltip.label}</strong>
            {tooltip.sign && <span className="tooltip-symbol">
              {layout.segments.find(s => s.sign === tooltip.sign)?.meta?.symbol}
            </span>}
          </div>
          <div className="tooltip-ring">{tooltip.ring}: {tooltip.label}</div>
        </div>
      )}
    </div>
  );
};

export default SeasonRings;
