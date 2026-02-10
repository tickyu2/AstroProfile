# GENESIS - BATCH 4 PART 1: CORE COMPONENTS
## D3 Visualizations + Interactive UI

**Total Files in Part 1:** 6 component files  
**Installation Time:** 1.5 hours  
**Prerequisites:** BATCH 1 + BATCH 2 + BATCH 3 installed

---

## 📂 FILE STRUCTURE (PART 1)

```
src/seasonal-ecology/
└── components/
    ├── ScienceNote.tsx (FILE 11)
    ├── ScienceNote.css (FILE 12)
    ├── SeasonRings.tsx (FILE 13)
    ├── SeasonRings.css (FILE 14)
    ├── SeasonLegend.tsx (FILE 15)
    └── SeasonLegend.css (FILE 16)
```

---

## FILE 11: components/ScienceNote.tsx

```tsx
/**
 * Science Note Component
 * Collapsible educational content explaining scientific basis
 */

import React, { useState } from 'react';
import './ScienceNote.css';

interface ScienceNoteProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ScienceNote: React.FC<ScienceNoteProps> = ({ 
  title = "Science Notes",
  children,
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="science-note">
      <div 
        className="science-note-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <span className="science-icon">📊</span>
        <span className="science-title">{title}</span>
        <span className="science-toggle">
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="science-note-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default ScienceNote;
```

---

## FILE 12: components/ScienceNote.css

```css
.science-note {
  background: rgba(100, 150, 255, 0.08);
  border-left: 3px solid #6496ff;
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.science-note:hover {
  background: rgba(100, 150, 255, 0.12);
}

.science-note-header {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.science-note-header:focus {
  outline: 2px solid #6496ff;
  outline-offset: 2px;
  border-radius: 4px;
}

.science-icon {
  font-size: 1.1em;
  flex-shrink: 0;
}

.science-title {
  flex: 1;
  font-weight: 600;
  color: #6496ff;
  font-size: 0.95em;
  letter-spacing: 0.3px;
}

.science-toggle {
  color: #6496ff;
  font-size: 0.8em;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.science-note-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(100, 150, 255, 0.15);
  color: #d0d0d0;
  line-height: 1.7;
  font-size: 0.95em;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.science-note-content h4 {
  color: #6496ff;
  font-size: 1.05em;
  margin-bottom: 12px;
  font-weight: 600;
}

.science-note-content ul {
  margin-left: 20px;
  margin-top: 12px;
  margin-bottom: 16px;
}

.science-note-content li {
  margin-bottom: 14px;
  color: #e0e0e0;
}

.science-note-content li strong {
  color: #8fb4ff;
  font-weight: 600;
}

.science-note-content p {
  margin-bottom: 12px;
  color: #d0d0d0;
}

.science-note-content .emphasis {
  color: #ffd700;
  font-style: italic;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .science-note {
    padding: 10px 14px;
  }
  
  .science-note-content {
    font-size: 0.9em;
  }
}
```

---

## FILE 13: components/SeasonRings.tsx

```tsx
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
```

---

## FILE 14: components/SeasonRings.css

```css
.season-rings-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.season-rings-svg {
  width: 100%;
  height: auto;
  display: block;
}

.season-rings-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  pointer-events: none;
  font-size: 13px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: tooltipFadeIn 0.2s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-weight: 600;
  color: #ffd700;
}

.tooltip-symbol {
  font-size: 1.2em;
}

.tooltip-ring {
  font-size: 0.9em;
  color: #d0d0d0;
  text-transform: capitalize;
}

/* Responsive */
@media (max-width: 768px) {
  .season-rings-container {
    max-width: 100%;
  }
}
```

---

## FILE 15: components/SeasonLegend.tsx

```tsx
/**
 * Season Legend Component
 * Visual explanation of the three concentric rings
 */

import React from 'react';
import './SeasonLegend.css';

interface SeasonLegendProps {
  colors?: {
    season: string;
    modality: string;
    element: string;
  };
  className?: string;
}

export const SeasonLegend: React.FC<SeasonLegendProps> = ({ 
  colors = {
    season: "#90EE90",
    modality: "#FF6B6B",
    element: "#FF4500"
  },
  className = ""
}) => {
  return (
    <div className={`season-legend ${className}`}>
      <div className="legend-title">Ring System</div>

      <div className="legend-item">
        <div 
          className="legend-color-box" 
          style={{ background: colors.season }}
        />
        <div className="legend-text">
          <strong>Season Ring (Outer)</strong>
          <span>Environmental imprint from birth season</span>
          <span className="legend-values">Spring · Summer · Autumn · Winter</span>
        </div>
      </div>

      <div className="legend-item">
        <div 
          className="legend-color-box" 
          style={{ background: colors.modality }}
        />
        <div className="legend-text">
          <strong>Modality Ring (Middle)</strong>
          <span>Circadian momentum style</span>
          <span className="legend-values">Cardinal · Fixed · Mutable</span>
        </div>
      </div>

      <div className="legend-item">
        <div 
          className="legend-color-box" 
          style={{ background: colors.element }}
        />
        <div className="legend-text">
          <strong>Element Ring (Inner)</strong>
          <span>Constitutional temperament</span>
          <span className="legend-values">Fire · Earth · Air · Water</span>
        </div>
      </div>

      <div className="legend-note">
        Each zodiac sign is an intersection of these three rings
      </div>
    </div>
  );
};

export default SeasonLegend;
```

---

## FILE 16: components/SeasonLegend.css

```css
.season-legend {
  background: rgba(26, 26, 46, 0.9);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.legend-title {
  font-size: 1.1em;
  font-weight: 700;
  color: #6496ff;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.legend-color-box {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.legend-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.legend-text strong {
  color: #e0e0e0;
  font-size: 0.95em;
  font-weight: 600;
}

.legend-text span {
  color: #b0b0b0;
  font-size: 0.85em;
  line-height: 1.4;
}

.legend-values {
  color: #8496ff !important;
  font-style: italic;
  font-size: 0.8em !important;
  margin-top: 2px;
}

.legend-note {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(100, 150, 255, 0.2);
  color: #999;
  font-size: 0.8em;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .season-legend {
    padding: 16px;
  }

  .legend-item {
    gap: 10px;
  }
}
```

---

## ✅ BATCH 4 PART 1 COMPLETION CHECKLIST

- [ ] Create `src/seasonal-ecology/components/` directory
- [ ] Add FILE 11: ScienceNote.tsx
- [ ] Add FILE 12: ScienceNote.css
- [ ] Add FILE 13: SeasonRings.tsx (Main D3 component!)
- [ ] Add FILE 14: SeasonRings.css
- [ ] Add FILE 15: SeasonLegend.tsx
- [ ] Add FILE 16: SeasonLegend.css
- [ ] Verify imports resolve correctly
- [ ] Test SeasonRings renders with `toFullZodiacRingLayout()` data

---

**BATCH 4 PART 2 coming next:** Taurus Zoom Strip + Explanation Components + Complete Page Integration! 🔥🐉
