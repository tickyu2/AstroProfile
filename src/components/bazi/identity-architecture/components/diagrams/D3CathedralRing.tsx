/**
 * D3CathedralRing — Interactive cathedral ring with:
 *   - Click to highlight tensions (click a node to see its tension lines glow)
 *   - Hover tooltips showing pillar details + hidden stems
 *   - Drag to rotate the entire ring (rotatable mandala)
 *   - D3 animation timeline: auto-rotation, pulsing tension lines, breathing glow
 *   - Severity-based pulse speed
 *   - Element-colored nodes with halos
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { HIDDEN_STEMS } from '../../../../../utils/baziWheels';
import type { BaZiPillar, TensionItem } from '../../engine/identityTypes';
import { ELEMENT_COLORS, PILLAR_ROLE_LABELS, PILLAR_NAMES } from '../../utils/elementTheme';
import { toRad, PILLAR_ANGLES } from '../../utils/svgUtils';

interface Props {
  pillars: BaZiPillar[];
  tensions: TensionItem[];
  coherenceIndex: number;
  severity?: number;  // 0-1, drives animation intensity (pulse speed, glow, rotation)
  onSelectPillar?: (role: string | null) => void;
}

interface NodeData {
  x: number;
  y: number;
  baseAngle: number;
  element: string;
  branchEl: string;
  branch: string;
  role: string;
  stemChar: string;
  branchChar: string;
  pillarIdx: number;
}

interface TensionLineData {
  sourceIdx: number;
  targetIdx: number;
  severity: number;
  text: string;
}

export const D3CathedralRing: React.FC<Props> = ({
  pillars, tensions, coherenceIndex, severity = 0.3, onSelectPillar,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const selectedRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);
  const autoRotateTimerRef = useRef<ReturnType<typeof d3.timer> | null>(null);

  const buildTensionLines = useCallback((): TensionLineData[] => {
    const cross = tensions
      .filter(t => t.sourcePillar !== t.targetPillar && t.sourcePillar >= 0 && t.targetPillar >= 0)
      .map(t => ({
        sourceIdx: t.sourcePillar,
        targetIdx: t.targetPillar,
        severity: t.severity,
        text: t.text,
      }));

    if (cross.length === 0 && tensions.length > 0) {
      const tc = tensions.length;
      const fallback: TensionLineData[] = [];
      if (tc >= 1) fallback.push({ sourceIdx: 0, targetIdx: 2, severity: 2, text: tensions[0].text });
      if (tc >= 2) fallback.push({ sourceIdx: 1, targetIdx: 2, severity: 2, text: tensions[1].text });
      if (tc >= 3) fallback.push({ sourceIdx: 2, targetIdx: 3, severity: 2, text: tensions[2].text });
      if (tc >= 4) fallback.push({ sourceIdx: 0, targetIdx: 3, severity: 2, text: tensions[3].text });
      return fallback;
    }
    return cross;
  }, [tensions]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = 340, h = 340;
    const cx = w / 2, cy = h / 2, r = 130;

    // ─── Severity-driven animation parameters ───
    const glowBlur = 3 + severity * 6;           // 3-9px blur radius
    const haloBlur = 2 + severity * 4;            // 2-6px halo blur
    const breatheDuration = 4000 - severity * 2000; // 4s calm → 2s intense
    const haloDuration = 4500 - severity * 2000;    // 4.5s calm → 2.5s intense
    const haloMaxOpacity = 0.25 + severity * 0.45;  // 0.25 calm → 0.70 intense
    const haloMaxR = 29 + severity * 6;             // 29 calm → 35 intense
    const autoRotSpeed = 0.008 + severity * 0.025;  // 0.008 calm → 0.033 intense
    const hueShift = severity * 25;                  // 0 calm → 25deg warm shift

    // ─── SVG Defs: glow filters ───
    const defs = svg.append('defs');

    // Breathing glow filter for outer ring (scales with severity)
    const ringGlow = defs.append('filter')
      .attr('id', 'ringBreathingGlow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    ringGlow.append('feGaussianBlur')
      .attr('in', 'SourceGraphic').attr('stdDeviation', glowBlur).attr('result', 'blur');
    ringGlow.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

    // Element halo filter
    const haloFilter = defs.append('filter')
      .attr('id', 'elementHalo')
      .attr('x', '-60%').attr('y', '-60%')
      .attr('width', '220%').attr('height', '220%');
    haloFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic').attr('stdDeviation', haloBlur).attr('result', 'blur');
    haloFilter.append('feMerge')
      .selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', d => d);

    // Build node data
    const nodes: NodeData[] = pillars.map((p, i) => {
      const angle = PILLAR_ANGLES[i] + rotationRef.current;
      const rad = toRad(angle);
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
        baseAngle: PILLAR_ANGLES[i],
        element: p.stem.element,
        branchEl: p.branch.element,
        branch: p.branch.animal,
        role: PILLAR_NAMES[i],
        stemChar: p.stem.char,
        branchChar: p.branch.char,
        pillarIdx: i,
      };
    });

    const tensionLineData = buildTensionLines();

    // ─── Outer ring with breathing glow ───
    const outerRing = svg.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', r)
      .attr('fill', 'none').attr('stroke', '#475569').attr('stroke-width', 2.5)
      .attr('filter', 'url(#ringBreathingGlow)');

    // D3 breathing glow — faster & brighter when severity is high
    const breatheStrokeMax = 2.5 + severity * 2;   // 2.5 calm → 4.5 intense
    const breatheStrokeMin = 2;
    const breatheColorMax = severity > 0.6 ? '#94a3b8' : '#64748b'; // brighter when tense
    function breatheRing() {
      outerRing
        .transition('breathe')
        .duration(breatheDuration)
        .ease(d3.easeSinInOut)
        .attr('stroke', breatheColorMax)
        .attr('stroke-width', breatheStrokeMax)
        .transition('breathe')
        .duration(breatheDuration)
        .ease(d3.easeSinInOut)
        .attr('stroke', '#475569')
        .attr('stroke-width', breatheStrokeMin)
        .on('end', breatheRing);
    }
    breatheRing();

    // Inner coherence glow
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', r - 25)
      .attr('fill', '#38bdf8')
      .attr('class', 'ia-coherence-glow')
      .attr('opacity', 0.06 + (coherenceIndex / 100) * 0.2);

    // Harmony lines (adjacent pillars)
    nodes.forEach((a, i) => {
      const b = nodes[(i + 1) % nodes.length];
      svg.append('line')
        .attr('class', 'ia-harmony-line')
        .attr('x1', a.x).attr('y1', a.y).attr('x2', b.x).attr('y2', b.y)
        .attr('stroke', '#334155').attr('stroke-width', 1).attr('opacity', 0.5);
    });

    // ─── Tension lines with D3 pulse timeline ───
    const tensionG = svg.append('g').attr('class', 'ia-tension-group');
    const tLines = tensionG.selectAll<SVGLineElement, TensionLineData>('line.ia-tension-line')
      .data(tensionLineData)
      .enter()
      .append('line')
      .attr('class', 'ia-tension-line')
      .attr('data-severity', d => d.severity)
      .attr('x1', d => nodes[d.sourceIdx].x)
      .attr('y1', d => nodes[d.sourceIdx].y)
      .attr('x2', d => nodes[d.targetIdx].x)
      .attr('y2', d => nodes[d.targetIdx].y)
      .attr('stroke', '#ef4444')
      .attr('stroke-dasharray', '5 3')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.15);

    function pulseSingle(
      line: d3.Selection<SVGLineElement, TensionLineData, null, undefined>,
      d: TensionLineData,
    ) {
      if (line.classed('ia-highlighted') || line.classed('ia-dimmed')) return;
      // Severity scales the base speed: global severity + per-line severity
      const baseSpeed = 2200 - severity * 800;  // 2200ms calm → 1400ms intense
      const speed = baseSpeed + (3 - d.severity) * 300; // per-line: severity 3 = fastest
      const peakWidth = 2.5 + d.severity * 0.3 + severity * 1.2; // wider when more tense
      const peakOpacity = 0.7 + severity * 0.25;  // brighter when more tense
      line
        .transition('pulse')
        .duration(speed / 2)
        .ease(d3.easeSinInOut)
        .attr('stroke-opacity', peakOpacity)
        .attr('stroke-width', peakWidth)
        .transition('pulse')
        .duration(speed / 2)
        .ease(d3.easeSinInOut)
        .attr('stroke-opacity', 0.12)
        .attr('stroke-width', 0.8)
        .on('end', function () {
          pulseSingle(d3.select(this), d);
        });
    }
    // Stagger start so lines don't pulse in unison
    tLines.each(function (d, i) {
      d3.timeout(() => pulseSingle(d3.select(this), d), i * 400);
    });

    // Center text
    svg.append('text')
      .attr('x', cx).attr('y', cy - 6).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#94a3b8')
      .attr('class', 'cathedral-title')
      .text('Coherence');
    svg.append('text')
      .attr('x', cx).attr('y', cy + 14).attr('text-anchor', 'middle')
      .attr('font-size', 18).attr('font-weight', 700).attr('fill', '#e2e8f0')
      .text(`${coherenceIndex}%`);

    // ─── Pillar nodes with element halos ───
    const nodeGs = svg.selectAll<SVGGElement, NodeData>('g.ia-d3-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'ia-d3-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    // Halo ring (outer glow per element)
    nodeGs.append('circle')
      .attr('class', 'ia-node-halo')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', d => ELEMENT_COLORS[d.element] || '#64748b')
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.15)
      .attr('filter', 'url(#elementHalo)');

    // Main node circle
    nodeGs.append('circle')
      .attr('class', 'ia-node-main')
      .attr('r', 22)
      .attr('fill', '#0f172a')
      .attr('stroke', d => ELEMENT_COLORS[d.element] || '#64748b')
      .attr('stroke-width', 2.5);

    // Stem char (Chinese)
    nodeGs.append('text')
      .attr('text-anchor', 'middle').attr('dy', -2)
      .attr('font-size', 13).attr('font-weight', 700)
      .attr('fill', d => ELEMENT_COLORS[d.element] || '#94a3b8')
      .text(d => d.stemChar);

    // Role letter underneath
    nodeGs.append('text')
      .attr('text-anchor', 'middle').attr('dy', 11)
      .attr('font-size', 8).attr('fill', '#64748b')
      .text(d => d.role[0]);

    // D3 halo breathing on each node — severity drives intensity
    nodeGs.each(function (_, i) {
      const halo = d3.select(this).select('.ia-node-halo');
      function breatheHalo() {
        halo
          .transition('halo')
          .duration(haloDuration)
          .ease(d3.easeSinInOut)
          .attr('stroke-opacity', haloMaxOpacity)
          .attr('r', haloMaxR)
          .transition('halo')
          .duration(haloDuration)
          .ease(d3.easeSinInOut)
          .attr('stroke-opacity', 0.1)
          .attr('r', 28)
          .on('end', breatheHalo);
      }
      d3.timeout(breatheHalo, i * 700);
    });

    // ─── A. CLICK TO HIGHLIGHT TENSIONS ───
    nodeGs.on('click', function (_event, d) {
      const role = d.role;
      const isDeselect = selectedRef.current === role;
      selectedRef.current = isDeselect ? null : role;
      onSelectPillar?.(selectedRef.current);

      // Highlight/dim tension lines
      tensionG.selectAll<SVGLineElement, TensionLineData>('line.ia-tension-line')
        .each(function (t) {
          const line = d3.select(this);
          const involves = t.sourceIdx === d.pillarIdx || t.targetIdx === d.pillarIdx;

          if (isDeselect) {
            // Deselect: restore pulse
            line.classed('ia-highlighted', false).classed('ia-dimmed', false);
            line.interrupt('pulse');
            pulseSingle(line as d3.Selection<SVGLineElement, TensionLineData, null, undefined>, t);
          } else if (involves) {
            // Highlight: stop pulse, bright glow
            line.interrupt('pulse')
              .classed('ia-highlighted', true).classed('ia-dimmed', false)
              .attr('stroke-opacity', 1).attr('stroke-width', 3.5);
          } else {
            // Dim: stop pulse, fade out
            line.interrupt('pulse')
              .classed('ia-highlighted', false).classed('ia-dimmed', true)
              .attr('stroke-opacity', 0.08).attr('stroke-width', 0.5);
          }
        });

      // Highlight selected node
      svg.selectAll<SVGGElement, NodeData>('g.ia-d3-node')
        .classed('ia-selected', nd => !isDeselect && nd.role === role)
        .each(function (nd) {
          const g = d3.select(this);
          const isActive = !isDeselect && nd.role === role;
          g.select('.ia-node-main')
            .transition().duration(200)
            .attr('r', isActive ? 26 : 22)
            .attr('stroke-width', isActive ? 4 : 2.5);
          g.select('.ia-node-halo')
            .transition().duration(200)
            .attr('stroke-opacity', isActive ? 0.6 : 0.15)
            .attr('r', isActive ? 34 : 28);
        });
    });

    // ─── B. HOVER TOOLTIPS ───
    const tooltip = tooltipRef.current;
    if (tooltip) {
      nodeGs
        .on('mouseenter', function (_event, d) {
          isHoveringRef.current = true;
          const hs = HIDDEN_STEMS[pillars[d.pillarIdx].branch.index];
          const hiddenText = hs
            ? hs.map(h => `${h.char} ${h.element} (${h.percentage}%)`).join(', ')
            : 'None';

          const relatedTensions = tensionLineData
            .filter(t => t.sourceIdx === d.pillarIdx || t.targetIdx === d.pillarIdx)
            .map(t => t.text);

          tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:4px;color:${ELEMENT_COLORS[d.element] || '#e2e8f0'}">${d.role} Pillar</div>
            <div style="color:#94a3b8;font-size:10px">${PILLAR_ROLE_LABELS[d.role] || d.role}</div>
            <div style="margin-top:6px"><b>Heaven:</b> ${d.stemChar} ${d.element}</div>
            <div><b>Earth:</b> ${d.branchChar} ${d.branch} (${d.branchEl})</div>
            <div><b>Hidden:</b> ${hiddenText}</div>
            ${relatedTensions.length > 0 ? `
              <div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.1);padding-top:4px;color:#f87171">
                <b>Tensions:</b>
                ${relatedTensions.map(t => `<div style="margin-top:2px;font-size:10px">\u2022 ${t}</div>`).join('')}
              </div>
            ` : ''}
          `;
          tooltip.style.display = 'block';

          if (selectedRef.current !== d.role) {
            d3.select(this).select('.ia-node-main')
              .transition().duration(150).attr('r', 26).attr('stroke-width', 3.5);
            d3.select(this).select('.ia-node-halo')
              .transition().duration(150).attr('stroke-opacity', 0.5).attr('r', 32);
          }
        })
        .on('mousemove', function (event) {
          if (!tooltip) return;
          const container = svgRef.current?.parentElement;
          if (container) {
            const rect = container.getBoundingClientRect();
            tooltip.style.left = `${event.clientX - rect.left + 14}px`;
            tooltip.style.top = `${event.clientY - rect.top - 10}px`;
          }
        })
        .on('mouseleave', function (_event, d) {
          isHoveringRef.current = false;
          if (tooltip) tooltip.style.display = 'none';
          if (selectedRef.current !== d.role) {
            d3.select(this).select('.ia-node-main')
              .transition().duration(150).attr('r', 22).attr('stroke-width', 2.5);
            d3.select(this).select('.ia-node-halo')
              .transition().duration(150).attr('stroke-opacity', 0.15).attr('r', 28);
          }
        });
    }

    // ─── C. DRAG TO ROTATE THE RING ───
    const dragBehavior = d3.drag<SVGSVGElement, unknown>()
      .on('start', () => { isDraggingRef.current = true; })
      .on('drag', (event) => {
        const dx = event.dx;
        rotationRef.current += dx * 0.4;
        const rot = rotationRef.current;

        svg.selectAll<SVGGElement, NodeData>('g.ia-d3-node')
          .attr('transform', d => {
            const angle = d.baseAngle + rot;
            const rad = toRad(angle);
            d.x = cx + r * Math.cos(rad);
            d.y = cy + r * Math.sin(rad);
            return `translate(${d.x},${d.y})`;
          });

        svg.selectAll<SVGLineElement, unknown>('line.ia-harmony-line')
          .each(function (_, i) {
            const a = nodes[i];
            const b = nodes[(i + 1) % nodes.length];
            d3.select(this)
              .attr('x1', a.x).attr('y1', a.y)
              .attr('x2', b.x).attr('y2', b.y);
          });

        tensionG.selectAll<SVGLineElement, TensionLineData>('line.ia-tension-line')
          .attr('x1', d => nodes[d.sourceIdx].x)
          .attr('y1', d => nodes[d.sourceIdx].y)
          .attr('x2', d => nodes[d.targetIdx].x)
          .attr('y2', d => nodes[d.targetIdx].y);
      })
      .on('end', () => { isDraggingRef.current = false; });

    svg.call(dragBehavior);

    // ─── D2. HUE SHIFT — subtle warmth when tense ───
    if (hueShift > 0) {
      svg.style('filter', `hue-rotate(${hueShift}deg)`);
    }

    // ─── D. AUTO-ROTATION (speed scales with severity, pauses on interaction) ───
    const autoTimer = d3.timer(() => {
      if (isDraggingRef.current || isHoveringRef.current || selectedRef.current) return;

      rotationRef.current += autoRotSpeed; // calm ~2.9 deg/s → intense ~12 deg/s
      const rot = rotationRef.current;

      svg.selectAll<SVGGElement, NodeData>('g.ia-d3-node')
        .attr('transform', d => {
          const angle = d.baseAngle + rot;
          const rad = toRad(angle);
          d.x = cx + r * Math.cos(rad);
          d.y = cy + r * Math.sin(rad);
          return `translate(${d.x},${d.y})`;
        });

      svg.selectAll<SVGLineElement, unknown>('line.ia-harmony-line')
        .each(function (_, i) {
          const a = nodes[i];
          const b = nodes[(i + 1) % nodes.length];
          d3.select(this)
            .attr('x1', a.x).attr('y1', a.y)
            .attr('x2', b.x).attr('y2', b.y);
        });

      tensionG.selectAll<SVGLineElement, TensionLineData>('line.ia-tension-line')
        .attr('x1', d => nodes[d.sourceIdx].x)
        .attr('y1', d => nodes[d.sourceIdx].y)
        .attr('x2', d => nodes[d.targetIdx].x)
        .attr('y2', d => nodes[d.targetIdx].y);
    });
    autoRotateTimerRef.current = autoTimer;

    return () => {
      autoTimer.stop();
    };
  }, [pillars, tensions, coherenceIndex, severity, buildTensionLines, onSelectPillar]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      autoRotateTimerRef.current?.stop();
    };
  }, []);

  return (
    <div className="cathedral-ring-container" style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 340 340"
        style={{ width: 320, height: 320, cursor: 'grab' }}
        className="cathedral-ring-glow"
      />
      <div ref={tooltipRef} className="ia-d3-tooltip" style={{ display: 'none' }} />
      <div style={{
        textAlign: 'center', fontSize: '10px', color: '#475569', marginTop: '4px',
        letterSpacing: '0.04em',
      }}>
        Click node to highlight tensions · Drag to rotate · Hover for details
      </div>
    </div>
  );
};
