/**
 * BaZiBranchWheel.tsx — D3-powered SVG wheel visualizing 12 Earthly Branches,
 * their hidden stems, and a rotatable inner Heavenly Stem wheel.
 *
 * Pattern follows TropicalZodiacWheel.tsx: React + D3.js v7, SVG-based,
 * single useEffect clear-and-redraw.
 *
 * Layout (center outward):
 *   Center dot → Stem Wheel → Animal Ring → Yin/Yang → Hidden Stems → Season
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type {
  BranchWheelArc,
  HiddenStemArc,
  SeasonWheelArc,
  StemWheelArc,
} from '../../utils/branchWheelData';
import {
  ELEMENT_COLORS,
  yearToStemBranch,
  yearPillarLabel,
  getBranchPurity,
  getBranchSolarTerm,
  getBranchEndTerm,
} from '../../utils/branchWheelData';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BaZiBranchWheelProps {
  dimensions: { width: number; height: number };
  branchArcs: BranchWheelArc[];
  hiddenStemArcs: HiddenStemArc[];
  seasonArcs: SeasonWheelArc[];
  stemWheelArcs: StemWheelArc[];
  selectedBranch: number | null;
  hoveredBranch: number | null;
  highlightedElement: string | null;
  highlightedSeason: string | null;
  currentYear: number;
  onBranchClick: (idx: number) => void;
  onBranchHover: (idx: number | null) => void;
  onSeasonClick: (season: string) => void;
  onHiddenStemHover: (info: {
    branchIndex: number;
    stemChar: string;
    element: string;
    polarity: string;
    percentage: number;
    stemIndex: number;
  } | null) => void;
  onSeasonMarkerHover: (season: string | null) => void;
  onStemNavigate: (direction: 'prev' | 'next') => void;
  pillarMode?: 'off' | 'year' | 'month' | 'day' | 'hour';
  lockedBranch?: number | null;
  monthLabels?: {
    displayPos: number;
    branchIndex: number;
    label: string;
    startDate: string;
    endDate: string;
    startTerm: string;
    endTerm: string;
    startTermChinese: string;
    endTermChinese: string;
  }[] | null;
  dayLabels?: {
    displayPos: number;
    branchIndex: number;
    label: string;
    fullDate: string;
    isToday: boolean;
  }[] | null;
  hourLabels?: {
    displayPos: number;
    branchIndex: number;
    dateLabel: string;
    timeLabel: string;
    fullDateTime: string;
    isNow: boolean;
  }[] | null;
  spinTrigger?: number;
  pillarBranches?: { year?: number; month?: number; day?: number; hour?: number } | null;
  onBallLand?: (branchIndex: number, displayPos: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const POLARITY_TINT: Record<string, string> = {
  Yang: 'rgba(255,255,255,0.14)',
  Yin:  'rgba(0,0,0,0.22)',
};

const PHASE_LABELS: Record<string, string> = {
  Beginning:  'BEGINNING',
  Core:       'CORE',
  Transition: 'TRANSITION',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BaZiBranchWheel({
  dimensions,
  branchArcs,
  hiddenStemArcs,
  seasonArcs,
  stemWheelArcs,
  selectedBranch,
  hoveredBranch,
  highlightedElement,
  highlightedSeason,
  currentYear,
  onBranchClick,
  onBranchHover,
  onSeasonClick,
  onHiddenStemHover,
  onSeasonMarkerHover,
  onStemNavigate,
  pillarMode = 'off',
  lockedBranch = null,
  monthLabels = null,
  dayLabels = null,
  hourLabels = null,
  spinTrigger = 0,
  pillarBranches = null,
  onBallLand,
}: BaZiBranchWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const ballSvgRef = useRef<SVGSVGElement>(null);
  const ballAnimRef = useRef<number>(0);

  useEffect(() => {
    if (!svgRef.current || branchArcs.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const cx = width / 2;
    const cy = height / 2;
    const totalRadius = Math.min(width, height) / 2 - 15;

    // =====================================================================
    // Ring radii — center outward
    // Two distinct wheels separated by a visible dark gap
    // =====================================================================
    const hubR = totalRadius * 0.06;        // tiny center dot
    const stemInner = totalRadius * 0.08;   // Heavenly Stem wheel
    const stemOuter = totalRadius * 0.24;   // slightly larger inner wheel
    // --- DARK GAP between inner stem wheel and outer branch wheel ---
    // Year display lives in this gap
    const animalInner = totalRadius * 0.34;
    const animalOuter = totalRadius * 0.48;
    const yyInner = animalOuter + 2;        // Yin/Yang ring (narrow)
    const yyOuter = totalRadius * 0.52;
    const hsInner = yyOuter + 2;            // Hidden Stems ring
    const hsOuter = totalRadius * 0.77;
    const seasonInner = hsOuter + 3;        // Season ring
    const seasonOuter = totalRadius * 0.88;

    // Main group centered
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${cx},${cy})`);

    // Ensure defs exists
    const defs = svg.insert('defs', ':first-child');

    // =====================================================================
    // 0. 3D ROULETTE-WHEEL EFFECTS — gradients, filters, shadows
    // =====================================================================

    // Drop shadow filter for the whole wheel (raised off surface)
    const wheelShadow = defs.append('filter')
      .attr('id', 'wheelDropShadow')
      .attr('x', '-20%').attr('y', '-20%')
      .attr('width', '140%').attr('height', '140%');
    wheelShadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha').attr('stdDeviation', 8).attr('result', 'blur');
    wheelShadow.append('feOffset')
      .attr('in', 'blur').attr('dx', 4).attr('dy', 6).attr('result', 'shifted');
    wheelShadow.append('feFlood')
      .attr('flood-color', 'rgba(0,0,0,0.5)').attr('result', 'color');
    wheelShadow.append('feComposite')
      .attr('in', 'color').attr('in2', 'shifted').attr('operator', 'in').attr('result', 'shadow');
    const wheelShadowMerge = wheelShadow.append('feMerge');
    wheelShadowMerge.append('feMergeNode').attr('in', 'shadow');
    wheelShadowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Radial gradient for center dome (convex — light top-left, dark bottom-right)
    const hubGrad = defs.append('radialGradient')
      .attr('id', 'hubDome')
      .attr('cx', '35%').attr('cy', '35%').attr('r', '65%');
    hubGrad.append('stop').attr('offset', '0%').attr('stop-color', '#334155');
    hubGrad.append('stop').attr('offset', '50%').attr('stop-color', '#1e293b');
    hubGrad.append('stop').attr('offset', '100%').attr('stop-color', '#0f172a');

    // Radial gradient for stem wheel overlay (3D curvature)
    const stemCurve = defs.append('radialGradient')
      .attr('id', 'stemCurve3D')
      .attr('cx', '40%').attr('cy', '35%').attr('r', '70%');
    stemCurve.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.12)');
    stemCurve.append('stop').attr('offset', '45%').attr('stop-color', 'rgba(255,255,255,0.03)');
    stemCurve.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0.18)');

    // Radial gradient for gap channel (concave groove)
    const gapGroove = defs.append('radialGradient')
      .attr('id', 'gapGroove3D')
      .attr('cx', '40%').attr('cy', '35%').attr('r', '70%');
    gapGroove.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(0,0,0,0.15)');
    gapGroove.append('stop').attr('offset', '50%').attr('stop-color', 'rgba(0,0,0,0.35)');
    gapGroove.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0.5)');

    // Radial gradient for outer rings (3D curvature — wide)
    const outerCurve = defs.append('radialGradient')
      .attr('id', 'outerCurve3D')
      .attr('cx', '40%').attr('cy', '30%').attr('r', '75%');
    outerCurve.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.08)');
    outerCurve.append('stop').attr('offset', '40%').attr('stop-color', 'rgba(255,255,255,0.02)');
    outerCurve.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0.15)');

    // Metallic rim highlight gradient (top-lit chrome edge)
    const rimHighlight = defs.append('linearGradient')
      .attr('id', 'rimHighlight')
      .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    rimHighlight.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.4)');
    rimHighlight.append('stop').attr('offset', '50%').attr('stop-color', 'rgba(255,255,255,0.1)');
    rimHighlight.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(0,0,0,0.2)');

    // Specular highlight filter (soft glow at top-left)
    const specular = defs.append('filter')
      .attr('id', 'specularGlow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    specular.append('feGaussianBlur')
      .attr('in', 'SourceGraphic').attr('stdDeviation', 15);

    // --- Large shadow base under entire wheel ---
    g.append('circle')
      .attr('r', seasonOuter + 5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.3)')
      .attr('stroke-width', 12)
      .attr('filter', 'url(#wheelDropShadow)');

    // --- Specular highlight ellipse (top-left sheen) ---
    g.append('ellipse')
      .attr('cx', -totalRadius * 0.18)
      .attr('cy', -totalRadius * 0.22)
      .attr('rx', totalRadius * 0.35)
      .attr('ry', totalRadius * 0.25)
      .attr('fill', 'rgba(255,255,255,0.04)')
      .attr('filter', 'url(#specularGlow)')
      .attr('pointer-events', 'none');

    // =====================================================================
    // 1. CENTER HUB (raised dome with 3D gradient)
    // =====================================================================
    // Shadow ring under the dome
    g.append('circle')
      .attr('r', hubR + 2)
      .attr('fill', 'rgba(0,0,0,0.5)')
      .attr('filter', 'url(#specularGlow)');
    // Main dome
    g.append('circle')
      .attr('r', hubR)
      .attr('fill', 'url(#hubDome)')
      .attr('stroke', 'rgba(200,220,240,0.5)')
      .attr('stroke-width', 1.5);
    // Specular dot (the bright reflection on a polished knob)
    g.append('circle')
      .attr('cx', -hubR * 0.25)
      .attr('cy', -hubR * 0.25)
      .attr('r', hubR * 0.3)
      .attr('fill', 'rgba(255,255,255,0.25)');

    // =====================================================================
    // 2. HEAVENLY STEM WHEEL (inner ring — 12 segments, 10 stems + 2 wrap)
    // =====================================================================
    const stemArcGen = d3.arc<StemWheelArc>()
      .innerRadius(stemInner)
      .outerRadius(stemOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.02)
      .cornerRadius(3);

    const stemGroup = g.append('g').attr('class', 'stem-wheel');

    stemGroup.selectAll('path')
      .data(stemWheelArcs)
      .join('path')
      .attr('d', stemArcGen as any)
      .attr('fill', d => d.color + (d.isRepeat ? 'AA' : ''))
      .attr('opacity', d => {
        if (hoveredBranch !== null) {
          const branchArc = branchArcs.find(b => b.branchIndex === hoveredBranch);
          return branchArc && branchArc.displayPos === d.displayPos ? 1 : 0.4;
        }
        if (selectedBranch !== null) {
          const branchArc = branchArcs.find(b => b.branchIndex === selectedBranch);
          return branchArc && branchArc.displayPos === d.displayPos ? 1 : 0.5;
        }
        return d.isRepeat ? 0.65 : 0.85;
      })
      .attr('stroke', d => {
        // Highlight when aligned branch is active
        const branchArc = branchArcs.find(b => b.displayPos === d.displayPos);
        if (branchArc && branchArc.branchIndex === selectedBranch) return '#fff';
        if (branchArc && branchArc.branchIndex === hoveredBranch) return '#e2e8f0';
        return 'rgba(255,255,255,0.3)';
      })
      .attr('stroke-width', d => {
        const branchArc = branchArcs.find(b => b.displayPos === d.displayPos);
        return branchArc && branchArc.branchIndex === selectedBranch ? 2 : 0.5;
      })
      .attr('cursor', 'pointer')
      .on('mouseover', function (_event, d) {
        const branchArc = branchArcs.find(b => b.displayPos === d.displayPos);
        if (branchArc) onBranchHover(branchArc.branchIndex);
      })
      .on('mouseout', function () {
        onBranchHover(null);
      })
      .on('click', function (_event, d) {
        const branchArc = branchArcs.find(b => b.displayPos === d.displayPos);
        if (branchArc) onBranchClick(branchArc.branchIndex);
      });

    // 3D curvature overlay for stem wheel (non-interactive)
    stemGroup.append('circle')
      .attr('r', stemOuter)
      .attr('fill', 'url(#stemCurve3D)')
      .attr('pointer-events', 'none');
    // Inner bevel highlight (lit edge)
    stemGroup.append('circle')
      .attr('r', stemInner + 1)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.18)')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');
    // Outer bevel shadow (undercut edge)
    stemGroup.append('circle')
      .attr('r', stemOuter - 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.25)')
      .attr('stroke-width', 1.5)
      .attr('pointer-events', 'none');

    // Stem labels — character + English name
    const stemCharR = stemInner + (stemOuter - stemInner) * 0.32;
    const stemNameR = stemInner + (stemOuter - stemInner) * 0.78;

    stemWheelArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const sx = stemCharR * Math.cos(midAngle);
      const sy = stemCharR * Math.sin(midAngle);

      // Chinese character
      stemGroup.append('text')
        .attr('x', sx).attr('y', sy)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#fff')
        .attr('font-size', Math.max(11, (stemOuter - stemInner) * 0.22))
        .attr('font-weight', 700)
        .attr('pointer-events', 'none')
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))')
        .text(arc.char);

      // Element short name (e.g. "Wood")
      const nx = stemNameR * Math.cos(midAngle);
      const ny = stemNameR * Math.sin(midAngle);
      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      stemGroup.append('text')
        .attr('x', nx).attr('y', ny)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${nx}, ${ny})`)
        .attr('fill', '#fff')
        .attr('font-size', Math.max(8, (stemOuter - stemInner) * 0.13))
        .attr('font-weight', 600)
        .attr('pointer-events', 'none')
        .attr('filter', 'drop-shadow(0 1px 1px rgba(0,0,0,0.9))')
        .text(arc.english);
    });

    // Navigation arrows — at center left (9 o'clock) and center right (3 o'clock)
    const navR = (stemInner + stemOuter) / 2;
    const navBtnR = 14;
    const navPositions = [
      { x: -navR, y: 0, dir: 'prev' as const, label: '◀' },
      { x: navR, y: 0, dir: 'next' as const, label: '▶' },
    ];

    const navGroup = g.append('g').attr('class', 'nav-buttons');
    navPositions.forEach(nav => {
      // Button circle
      navGroup.append('circle')
        .attr('cx', nav.x).attr('cy', nav.y)
        .attr('r', navBtnR)
        .attr('fill', 'rgba(15,23,42,0.85)')
        .attr('stroke', 'rgba(99,102,241,0.4)')
        .attr('stroke-width', 1.5)
        .attr('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this)
            .transition().duration(100)
            .attr('fill', 'rgba(99,102,241,0.25)')
            .attr('stroke', '#a5b4fc');
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition().duration(100)
            .attr('fill', 'rgba(15,23,42,0.85)')
            .attr('stroke', 'rgba(99,102,241,0.4)');
        })
        .on('click', function () {
          // Animate stem wheel + gap ring rotating before data update
          const rotDeg = (pillarMode === 'day' || pillarMode === 'hour')
            ? (nav.dir === 'next' ? -30 : 30)   // day/hour mode: 1 branch = 30°
            : (nav.dir === 'next' ? -60 : 60);  // year/month mode: 60°
          const duration = 500;

          // Spin stem wheel
          stemGroup
            .transition().duration(duration)
            .ease(d3.easeCubicInOut)
            .attrTween('transform', () => {
              const interp = d3.interpolate(0, rotDeg);
              return (t: number) => `rotate(${interp(t)})`;
            });

          // Spin gap/year ring in sync
          gapGroup
            .transition().duration(duration)
            .ease(d3.easeCubicInOut)
            .attrTween('transform', () => {
              const interp = d3.interpolate(0, rotDeg);
              return (t: number) => `rotate(${interp(t)})`;
            });

          // After animation completes, update data (triggers full redraw)
          setTimeout(() => onStemNavigate(nav.dir), duration + 20);
        });

      // Arrow label
      navGroup.append('text')
        .attr('x', nav.x).attr('y', nav.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('fill', '#a5b4fc')
        .attr('font-size', 9)
        .attr('font-weight', 700)
        .attr('pointer-events', 'none')
        .text(nav.label);
    });

    // =====================================================================
    // 2b. DARK GAP — recessed groove between stem wheel and outer wheel
    //     3D roulette channel effect — Year display lives here
    // =====================================================================
    const gapGroup = g.append('g').attr('class', 'wheel-gap');
    const gapMidR = (stemOuter + animalInner) / 2;
    const gapWidth = animalInner - stemOuter;

    // Dark filled ring base (the recessed channel)
    gapGroup.append('circle')
      .attr('r', gapMidR)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(2,6,23,0.97)')
      .attr('stroke-width', gapWidth);

    // 3D concave groove overlay
    gapGroup.append('circle')
      .attr('r', gapMidR)
      .attr('fill', 'none')
      .attr('stroke', 'url(#gapGroove3D)')
      .attr('stroke-width', gapWidth)
      .attr('pointer-events', 'none');

    // Inner rim — sharp highlight on stem wheel outer lip (top-lit raised edge)
    gapGroup.append('circle')
      .attr('r', stemOuter + 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(200,220,240,0.45)')
      .attr('stroke-width', 1);

    // Inner shadow — the stem wheel casts shadow into the groove
    gapGroup.append('circle')
      .attr('r', stemOuter + 3)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.7)')
      .attr('stroke-width', 3);

    // Outer rim — sharp highlight on animal ring inner lip
    gapGroup.append('circle')
      .attr('r', animalInner - 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(200,220,240,0.35)')
      .attr('stroke-width', 1);

    // Outer shadow — the animal ring casts shadow inward
    gapGroup.append('circle')
      .attr('r', animalInner - 3)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.5)')
      .attr('stroke-width', 2.5);

    // --- 12 labels in the gap ring (one per branch) ---
    const gapYearR = gapMidR;   // centered in gap

    if (pillarMode === 'hour' && hourLabels) {
      // HOUR MODE — show "Mar 7" + "1–3 AM" etc.
      hourLabels.forEach(hl => {
        const arc = branchArcs.find(a => a.displayPos === hl.displayPos);
        if (!arc) return;
        const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

        let rotation = (midAngle * 180 / Math.PI) + 90;
        if (rotation > 90 && rotation < 270) rotation += 180;

        const tx = gapYearR * Math.cos(midAngle);
        const ty = gapYearR * Math.sin(midAngle);

        // Date label (e.g. "Mar 7")
        gapGroup.append('text')
          .attr('x', tx).attr('y', ty - 5)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', hl.isNow ? '#f472b6' : '#e2e8f0')
          .attr('font-size', hl.isNow ? 13 : 11)
          .attr('font-weight', hl.isNow ? 800 : 700)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(hl.dateLabel);

        // Time window label (e.g. "1–3 AM")
        gapGroup.append('text')
          .attr('x', tx).attr('y', ty + 6)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', hl.isNow ? '#f472b6' : '#cbd5e1')
          .attr('font-size', hl.isNow ? 10 : 9)
          .attr('font-weight', 700)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(hl.timeLabel);

        // "NOW" micro-label
        if (hl.isNow) {
          gapGroup.append('text')
            .attr('x', tx).attr('y', ty + 15)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
            .attr('fill', '#f472b6')
            .attr('font-size', 7)
            .attr('font-weight', 800)
            .attr('letter-spacing', '0.08em')
            .attr('pointer-events', 'none')
            .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
            .text('NOW');
        }

        // Hover tooltip showing full date + time range
        const hitW = 30;
        const hitH = 20;
        gapGroup.append('rect')
          .attr('x', tx - hitW / 2).attr('y', ty - hitH / 2)
          .attr('width', hitW).attr('height', hitH)
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', 'transparent')
          .attr('cursor', 'pointer')
          .on('mouseover', function () {
            const tooltipId = 'hour-tooltip';
            g.selectAll(`#${tooltipId}`).remove();
            const ttG = g.append('g').attr('id', tooltipId);
            const ttW = 160;
            const ttH = 28;
            const ttX = tx > 0 ? tx + 20 : tx - ttW - 20;
            const ttY = ty - ttH / 2;
            ttG.append('rect')
              .attr('x', ttX).attr('y', ttY)
              .attr('width', ttW).attr('height', ttH)
              .attr('rx', 6)
              .attr('fill', 'rgba(15,23,42,0.95)')
              .attr('stroke', 'rgba(244,114,182,0.4)')
              .attr('stroke-width', 1);
            ttG.append('text')
              .attr('x', ttX + 10).attr('y', ttY + 16)
              .attr('fill', hl.isNow ? '#f472b6' : '#e2e8f0')
              .attr('font-size', 10).attr('font-weight', 700)
              .text(`${hl.fullDateTime}${hl.isNow ? ' (Now)' : ''}`);
          })
          .on('mouseout', function () {
            g.selectAll('#hour-tooltip').remove();
          });
      });
    } else if (pillarMode === 'day' && dayLabels) {
      // DAY MODE — show "Feb 25", "Feb 26" etc.
      dayLabels.forEach(dl => {
        const arc = branchArcs.find(a => a.displayPos === dl.displayPos);
        if (!arc) return;
        const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

        let rotation = (midAngle * 180 / Math.PI) + 90;
        if (rotation > 90 && rotation < 270) rotation += 180;

        const tx = gapYearR * Math.cos(midAngle);
        const ty = gapYearR * Math.sin(midAngle);

        // Day label (e.g. "Feb 25")
        gapGroup.append('text')
          .attr('x', tx).attr('y', ty - 3)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', dl.isToday ? '#c084fc' : '#e2e8f0')
          .attr('font-size', dl.isToday ? 12 : 10)
          .attr('font-weight', dl.isToday ? 800 : 600)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(dl.label);

        // "TODAY" micro-label
        if (dl.isToday) {
          gapGroup.append('text')
            .attr('x', tx).attr('y', ty + 7)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
            .attr('fill', '#c084fc')
            .attr('font-size', 7)
            .attr('font-weight', 800)
            .attr('letter-spacing', '0.08em')
            .attr('pointer-events', 'none')
            .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
            .text('TODAY');
        }

        // Hover tooltip showing full date
        const hitW = 30;
        const hitH = 20;
        gapGroup.append('rect')
          .attr('x', tx - hitW / 2).attr('y', ty - hitH / 2)
          .attr('width', hitW).attr('height', hitH)
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', 'transparent')
          .attr('cursor', 'pointer')
          .on('mouseover', function () {
            const tooltipId = 'day-tooltip';
            g.selectAll(`#${tooltipId}`).remove();
            const ttG = g.append('g').attr('id', tooltipId);
            const ttW = 140;
            const ttH = 28;
            const ttX = tx > 0 ? tx + 20 : tx - ttW - 20;
            const ttY = ty - ttH / 2;
            ttG.append('rect')
              .attr('x', ttX).attr('y', ttY)
              .attr('width', ttW).attr('height', ttH)
              .attr('rx', 6)
              .attr('fill', 'rgba(15,23,42,0.95)')
              .attr('stroke', 'rgba(168,85,247,0.4)')
              .attr('stroke-width', 1);
            ttG.append('text')
              .attr('x', ttX + 10).attr('y', ttY + 16)
              .attr('fill', dl.isToday ? '#c084fc' : '#e2e8f0')
              .attr('font-size', 10).attr('font-weight', 700)
              .text(`${dl.fullDate}${dl.isToday ? ' (Today)' : ''}`);
          })
          .on('mouseout', function () {
            g.selectAll('#day-tooltip').remove();
          });
      });
    } else if (pillarMode === 'month' && monthLabels) {
      // MONTH MODE — show "Feb 2026", "Mar 2026" etc.
      const now = new Date();
      const currentMonthStr = now.toLocaleString('en-US', { month: 'short' });
      const currentYearNow = now.getFullYear();

      monthLabels.forEach(ml => {
        const arc = branchArcs.find(a => a.displayPos === ml.displayPos);
        if (!arc) return;
        const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

        let rotation = (midAngle * 180 / Math.PI) + 90;
        if (rotation > 90 && rotation < 270) rotation += 180;

        const tx = gapYearR * Math.cos(midAngle);
        const ty = gapYearR * Math.sin(midAngle);

        const isCurrent = ml.label.startsWith(currentMonthStr) && ml.label.endsWith(String(currentYearNow));

        gapGroup.append('text')
          .attr('x', tx).attr('y', ty - 3)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', isCurrent ? '#2dd4bf' : '#e2e8f0')
          .attr('font-size', isCurrent ? 12 : 10)
          .attr('font-weight', isCurrent ? 800 : 600)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(ml.label);

        const hitW = 30;
        const hitH = 20;
        gapGroup.append('rect')
          .attr('x', tx - hitW / 2).attr('y', ty - hitH / 2)
          .attr('width', hitW).attr('height', hitH)
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', 'transparent')
          .attr('cursor', 'pointer')
          .on('mouseover', function () {
            const tooltipId = 'month-tooltip';
            g.selectAll(`#${tooltipId}`).remove();
            const ttG = g.append('g').attr('id', tooltipId);
            const ttW = 220;
            const ttH = 48;
            const ttX = tx > 0 ? tx + 20 : tx - ttW - 20;
            const ttY = ty - ttH / 2;
            ttG.append('rect')
              .attr('x', ttX).attr('y', ttY)
              .attr('width', ttW).attr('height', ttH)
              .attr('rx', 6)
              .attr('fill', 'rgba(15,23,42,0.95)')
              .attr('stroke', 'rgba(45,212,191,0.4)')
              .attr('stroke-width', 1);
            ttG.append('text')
              .attr('x', ttX + 10).attr('y', ttY + 16)
              .attr('fill', '#2dd4bf').attr('font-size', 10).attr('font-weight', 700)
              .text(`${ml.startTermChinese} ${ml.startTerm} (${ml.startDate})`);
            ttG.append('text')
              .attr('x', ttX + 10).attr('y', ttY + 34)
              .attr('fill', '#94a3b8').attr('font-size', 10).attr('font-weight', 600)
              .text(`→ ${ml.endTermChinese} ${ml.endTerm} (${ml.endDate})`);
          })
          .on('mouseout', function () {
            g.selectAll('#month-tooltip').remove();
          });
      });
    } else {
      // YEAR MODE (or off) — show year numbers + GanZhi
      const { branchIndex: currentBranchIdx } = yearToStemBranch(currentYear);
      const currentDisplayPos = ((currentBranchIdx - 2 + 12) % 12);

      branchArcs.forEach(arc => {
        const yearForBranch = currentYear + (arc.displayPos - currentDisplayPos);
        const pillar = yearPillarLabel(yearForBranch);
        const isCurrent = yearForBranch === currentYear;

        const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

        let rotation = (midAngle * 180 / Math.PI) + 90;
        if (rotation > 90 && rotation < 270) rotation += 180;

        const tx = gapYearR * Math.cos(midAngle);
        const ty = gapYearR * Math.sin(midAngle);

        // Year number
        gapGroup.append('text')
          .attr('x', tx).attr('y', ty - 5)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', isCurrent ? '#fff' : '#e2e8f0')
          .attr('font-size', isCurrent ? 13 : 11)
          .attr('font-weight', isCurrent ? 800 : 700)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(String(yearForBranch));

        // GanZhi characters
        gapGroup.append('text')
          .attr('x', tx).attr('y', ty + 6)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('transform', `rotate(${rotation}, ${tx}, ${ty})`)
          .attr('fill', isCurrent
            ? (ELEMENT_COLORS[pillar.stemElement] || '#f1f5f9')
            : '#cbd5e1')
          .attr('font-size', isCurrent ? 12 : 10)
          .attr('font-weight', 700)
          .attr('pointer-events', 'none')
          .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
          .text(pillar.ganZhi);
      });
    }

    // =====================================================================
    // 3. SPOKES (radial separator lines)
    // =====================================================================
    const spokeGroup = g.append('g').attr('class', 'spokes');
    branchArcs.forEach(arc => {
      const angle = arc.startAngle - Math.PI / 2;
      spokeGroup.append('line')
        .attr('x1', animalInner * Math.cos(angle))
        .attr('y1', animalInner * Math.sin(angle))
        .attr('x2', seasonOuter * Math.cos(angle))
        .attr('y2', seasonOuter * Math.sin(angle))
        .attr('stroke', 'rgba(148,163,184,0.15)')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '2,3');
    });

    // =====================================================================
    // 4. ANIMAL RING
    // =====================================================================
    const animalArcGen = d3.arc<BranchWheelArc>()
      .innerRadius(animalInner)
      .outerRadius(animalOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.015)
      .cornerRadius(3);

    const animalGroup = g.append('g').attr('class', 'animal-ring');

    animalGroup.selectAll('path')
      .data(branchArcs)
      .join('path')
      .attr('d', animalArcGen as any)
      .attr('fill', d => {
        const base = d.color;
        if (highlightedSeason && d.season !== highlightedSeason) return base + '40';
        if (selectedBranch !== null && d.branchIndex !== selectedBranch) return base + '60';
        if (hoveredBranch !== null && d.branchIndex !== hoveredBranch) return base + '50';
        return base;
      })
      .attr('opacity', d => {
        if (hoveredBranch !== null) return d.branchIndex === hoveredBranch ? 1 : 0.4;
        if (selectedBranch !== null) return d.branchIndex === selectedBranch ? 1 : 0.5;
        if (highlightedSeason) return d.season === highlightedSeason ? 1 : 0.35;
        return 0.85;
      })
      .attr('stroke', d => {
        if (d.branchIndex === selectedBranch) return '#fff';
        if (d.branchIndex === hoveredBranch) return '#e2e8f0';
        return 'rgba(0,0,0,0.3)';
      })
      .attr('stroke-width', d => (d.branchIndex === selectedBranch ? 2 : 0.5))
      .attr('cursor', 'pointer')
      .on('mouseover', function (_event, d) {
        onBranchHover(d.branchIndex);
        // Solar-term date tooltip
        const st = getBranchSolarTerm(d.branchIndex);
        const et = getBranchEndTerm(d.branchIndex);
        if (!st || !et) return;
        g.selectAll('#branch-date-tooltip').remove();
        const ttG = g.append('g').attr('id', 'branch-date-tooltip');
        const midA = (d.startAngle + d.endAngle) / 2 - Math.PI / 2;
        const tipR = (animalInner + animalOuter) / 2;
        const tx = Math.cos(midA) * tipR;
        const ty = Math.sin(midA) * tipR;
        const label = `${st.termChinese} ${st.approxDate} → ${et.approxDate}`;
        const ttW = label.length * 5.8 + 20;
        const ttH = 24;
        const ttX = tx > 0 ? tx + 18 : tx - ttW - 18;
        const ttY = ty - ttH / 2;
        ttG.append('rect')
          .attr('x', ttX).attr('y', ttY)
          .attr('width', ttW).attr('height', ttH)
          .attr('rx', 6)
          .attr('fill', 'rgba(15,23,42,0.95)')
          .attr('stroke', d.color + '80')
          .attr('stroke-width', 1);
        ttG.append('text')
          .attr('x', ttX + 10).attr('y', ttY + 16)
          .attr('fill', '#e2e8f0')
          .attr('font-size', 10).attr('font-weight', 600)
          .text(label);
      })
      .on('mouseout', function () {
        onBranchHover(null);
        g.selectAll('#branch-date-tooltip').remove();
      })
      .on('click', function (_event, d) { onBranchClick(d.branchIndex); });

    // Animal ring labels — 2 curved rows: inner = glyph + Chinese, outer = English name
    // Bottom-half arcs (3 o'clock → 9 o'clock) flip the path so text reads right-side-up.
    const innerLabelR = animalInner + (animalOuter - animalInner) * 0.28;
    const nameArcR = animalInner + (animalOuter - animalInner) * 0.72;

    branchArcs.forEach(arc => {
      const sa = arc.startAngle - Math.PI / 2;
      const ea = arc.endAngle - Math.PI / 2;
      const midD3 = (arc.startAngle + arc.endAngle) / 2;
      const isBottom = midD3 > Math.PI / 2 && midD3 < Math.PI * 3 / 2;

      // Helper: build arc path, flipped for bottom half
      const arcPathD = (r: number, flip: boolean) => {
        if (!flip) {
          return `M ${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A ${r},${r} 0 0,1 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}`;
        }
        // Reversed: counterclockwise from end to start
        return `M ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)} A ${r},${r} 0 0,0 ${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)}`;
      };

      // Row 1: glyph + Chinese character (curved along inner arc)
      const innerPathId = `innerArc-${arc.branchIndex}`;
      defs.append('path')
        .attr('id', innerPathId)
        .attr('d', arcPathD(innerLabelR, isBottom));

      animalGroup.append('text')
        .attr('pointer-events', 'none')
        .attr('fill', '#fff')
        .attr('font-size', Math.max(11, (animalOuter - animalInner) * 0.22))
        .attr('font-weight', 700)
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))')
        .attr('transform', `translate(${-cx},${-cy})`)
        .append('textPath')
          .attr('href', `#${innerPathId}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .text(`${arc.glyph} ${arc.char}`);

      // Row 2: English name (curved along outer arc, larger)
      const namePathId = `nameArc-${arc.branchIndex}`;
      defs.append('path')
        .attr('id', namePathId)
        .attr('d', arcPathD(nameArcR, isBottom));

      animalGroup.append('text')
        .attr('pointer-events', 'none')
        .attr('fill', '#fff')
        .attr('font-size', Math.max(10, (animalOuter - animalInner) * 0.20))
        .attr('font-weight', 700)
        .attr('letter-spacing', '0.5px')
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))')
        .attr('transform', `translate(${-cx},${-cy})`)
        .append('textPath')
          .attr('href', `#${namePathId}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .text(arc.animal);
    });

    // 3D curvature overlay for animal ring
    animalGroup.append('circle')
      .attr('r', (animalInner + animalOuter) / 2)
      .attr('fill', 'none')
      .attr('stroke', 'url(#outerCurve3D)')
      .attr('stroke-width', animalOuter - animalInner)
      .attr('pointer-events', 'none');
    // Inner bevel highlight
    animalGroup.append('circle')
      .attr('r', animalInner + 1)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.12)')
      .attr('stroke-width', 0.8)
      .attr('pointer-events', 'none');
    // Outer bevel shadow
    animalGroup.append('circle')
      .attr('r', animalOuter - 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.2)')
      .attr('stroke-width', 1)
      .attr('pointer-events', 'none');

    // =====================================================================
    // 5. YIN/YANG RING
    // =====================================================================
    const yyArcGen = d3.arc<BranchWheelArc>()
      .innerRadius(yyInner)
      .outerRadius(yyOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.015);

    const yyGroup = g.append('g').attr('class', 'yinyang-ring');

    yyGroup.selectAll('path')
      .data(branchArcs)
      .join('path')
      .attr('d', yyArcGen as any)
      .attr('fill', d => POLARITY_TINT[d.polarity])
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 1)
      .attr('opacity', d => {
        if (hoveredBranch !== null) return d.branchIndex === hoveredBranch ? 1 : 0.3;
        return 0.8;
      });

    // Curved polarity + element text — flip for bottom half readability
    // Bottom half: use outer edge of ring so text hangs down (outward) instead of protruding inward
    const yyLabelRTop = yyInner + 2;    // text extends outward from inner edge
    const yyLabelRBot = yyOuter - 1;    // text extends inward from outer edge
    branchArcs.forEach(arc => {
      const elColor = ELEMENT_COLORS[arc.element] || '#e2e8f0';
      const sa = arc.startAngle - Math.PI / 2;
      const ea = arc.endAngle - Math.PI / 2;
      const midD3 = (arc.startAngle + arc.endAngle) / 2;
      const isBottom = midD3 > Math.PI / 2 && midD3 < Math.PI * 3 / 2;
      const r = isBottom ? yyLabelRBot : yyLabelRTop;
      const pathId = `yyArc-${arc.branchIndex}`;

      const yyArcD = isBottom
        ? `M ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)} A ${r},${r} 0 0,0 ${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)}`
        : `M ${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A ${r},${r} 0 0,1 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}`;

      defs.append('path')
        .attr('id', pathId)
        .attr('d', yyArcD);

      yyGroup.append('text')
        .attr('pointer-events', 'none')
        .attr('fill', elColor)
        .attr('font-size', Math.max(10, (animalOuter - animalInner) * 0.20))
        .attr('font-weight', 700)
        .attr('filter', 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))')
        .attr('transform', `translate(${-cx},${-cy})`)
        .append('textPath')
          .attr('href', `#${pathId}`)
          .attr('startOffset', '50%')
          .attr('text-anchor', 'middle')
          .text(`${arc.polarity} ${arc.element}`);
    });

    // 3D chrome divider rings between major ring sections
    const chromeRings = g.append('g').attr('class', 'chrome-dividers').attr('pointer-events', 'none');
    // Between animal ring and yin/yang ring
    chromeRings.append('circle').attr('r', animalOuter + 1)
      .attr('fill', 'none').attr('stroke', 'rgba(200,220,240,0.2)').attr('stroke-width', 1);
    // Between yin/yang ring and hidden stems ring
    chromeRings.append('circle').attr('r', yyOuter + 1)
      .attr('fill', 'none').attr('stroke', 'rgba(200,220,240,0.18)').attr('stroke-width', 0.8);
    // Between hidden stems ring and season ring
    chromeRings.append('circle').attr('r', hsOuter + 1.5)
      .attr('fill', 'none').attr('stroke', 'rgba(200,220,240,0.22)').attr('stroke-width', 1);

    // =====================================================================
    // 6. HIDDEN STEMS RING
    // =====================================================================
    const hsArcGen = d3.arc<HiddenStemArc>()
      .innerRadius(hsInner)
      .outerRadius(hsOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.003)
      .cornerRadius(1);

    const hsGroup = g.append('g').attr('class', 'hidden-stems-ring');

    // Hidden stem sub-arcs — thin internal dividers only
    hsGroup.selectAll('path.hs-sub')
      .data(hiddenStemArcs)
      .join('path')
      .attr('class', 'hs-sub')
      .attr('d', hsArcGen as any)
      .attr('fill', d => d.color)
      .attr('opacity', d => {
        if (highlightedElement) return d.element === highlightedElement ? 1 : 0.15;
        const branchArc = branchArcs.find(b => b.branchIndex === d.branchIndex);
        if (highlightedSeason && branchArc && branchArc.season !== highlightedSeason) return 0.2;
        if (hoveredBranch !== null) return d.branchIndex === hoveredBranch ? 1 : 0.25;
        if (selectedBranch !== null) return d.branchIndex === selectedBranch ? 1 : 0.4;
        return 0.85;
      })
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 0.5)
      .attr('cursor', 'pointer')
      .on('mouseover', function (_event, d) {
        onBranchHover(d.branchIndex);
        onHiddenStemHover({
          branchIndex: d.branchIndex,
          stemChar: d.stemChar,
          element: d.element,
          polarity: d.polarity,
          percentage: d.percentage,
          stemIndex: d.stemIndex,
        });
        d3.select(this)
          .transition().duration(120)
          .attr('opacity', 1);
      })
      .on('mouseout', function () {
        onBranchHover(null);
        onHiddenStemHover(null);
      })
      .on('click', function (_event, d) {
        onBranchClick(d.branchIndex);
      });

    // White outline per branch — full pizza slice from year gap to hidden stems outer
    const hsBranchArcGen = d3.arc<BranchWheelArc>()
      .innerRadius(stemOuter)
      .outerRadius(hsOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.015)
      .cornerRadius(1);

    hsGroup.selectAll('path.hs-outline')
      .data(branchArcs)
      .join('path')
      .attr('class', 'hs-outline')
      .attr('d', hsBranchArcGen as any)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.branchIndex === selectedBranch || d.branchIndex === hoveredBranch) return '#fff';
        return 'rgba(255,255,255,0.6)';
      })
      .attr('stroke-width', d => {
        if (d.branchIndex === selectedBranch || d.branchIndex === hoveredBranch) return 2;
        return 1.2;
      })
      .attr('pointer-events', 'none');

    // Pure branch glow — bright element-colored outline for Pure branches (Rat, Rabbit, Rooster)
    const pureBranches = branchArcs.filter(a => getBranchPurity(a.branchIndex) === 'Pure');
    const pureGlowArc = d3.arc<BranchWheelArc>()
      .innerRadius(hsInner)
      .outerRadius(hsOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.015)
      .cornerRadius(1);

    hsGroup.selectAll('path.hs-pure-glow')
      .data(pureBranches)
      .join('path')
      .attr('class', 'hs-pure-glow')
      .attr('d', pureGlowArc as any)
      .attr('fill', 'none')
      .attr('stroke', d => ELEMENT_COLORS[d.element] || '#fbbf24')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.45)
      .attr('filter', 'url(#pureBranchGlow)')
      .attr('pointer-events', 'none');

    // SVG filter for glow
    if (!svg.select('defs #pureBranchGlow').node()) {
      const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs');
      const filter = defs.append('filter').attr('id', 'pureBranchGlow');
      filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '3');
    }

    // Hidden stem labels — single line "Element ##%" radially along each spoke
    // Placed near outer edge, right-aligned toward the rim so all labels anchor consistently.
    const hsLabelR = hsInner + (hsOuter - hsInner) * 0.55;
    const hsFontSize = Math.max(9, (hsOuter - hsInner) * 0.10);
    hiddenStemArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;

      // Flip on left half so text stays right-side-up
      let rot = midAngle * 180 / Math.PI;
      const onLeftSide = Math.cos(midAngle) < 0;
      if (onLeftSide) rot += 180;

      const lx = hsLabelR * Math.cos(midAngle);
      const ly = hsLabelR * Math.sin(midAngle);

      hsGroup.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rot}, ${lx}, ${ly})`)
        .attr('fill', '#fff')
        .attr('font-size', hsFontSize)
        .attr('font-weight', 700)
        .attr('pointer-events', 'none')
        .attr('filter', 'drop-shadow(0 1px 3px rgba(0,0,0,1)) drop-shadow(0 0 2px rgba(0,0,0,0.8))')
        .text(`${arc.element} ${arc.percentage}%`);
    });

    // No separate branch separators needed — white outlines above handle it

    // 3D overlay for hidden stems ring
    hsGroup.append('circle')
      .attr('r', (hsInner + hsOuter) / 2)
      .attr('fill', 'none')
      .attr('stroke', 'url(#outerCurve3D)')
      .attr('stroke-width', hsOuter - hsInner)
      .attr('pointer-events', 'none');
    // Beveled inner edge
    hsGroup.append('circle')
      .attr('r', hsInner + 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 0.5)
      .attr('pointer-events', 'none');

    // =====================================================================
    // 7. SEASON RING
    // =====================================================================
    const seasonArcGen = d3.arc<SeasonWheelArc>()
      .innerRadius(seasonInner)
      .outerRadius(seasonOuter)
      .startAngle(d => d.startAngle)
      .endAngle(d => d.endAngle)
      .padAngle(0.02)
      .cornerRadius(3);

    const seasonGroup = g.append('g').attr('class', 'season-ring');

    seasonGroup.selectAll('path')
      .data(seasonArcs)
      .join('path')
      .attr('d', seasonArcGen as any)
      .attr('fill', d => d.color)
      .attr('opacity', d => {
        if (highlightedSeason) return d.season === highlightedSeason ? 1 : 0.2;
        return 0.85;
      })
      .attr('stroke', d => (highlightedSeason === d.season ? '#fff' : 'rgba(0,0,0,0.15)'))
      .attr('stroke-width', d => (highlightedSeason === d.season ? 1.5 : 0.5))
      .attr('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).transition().duration(120).attr('opacity', 1);
      })
      .on('mouseout', function (_event, d) {
        d3.select(this).transition().duration(120)
          .attr('opacity', highlightedSeason === d.season ? 1 : 0.85);
      })
      .on('click', function (_event, d) {
        onSeasonClick(d.season);
      });

    // Phase labels
    const seasonLabelR = (seasonInner + seasonOuter) / 2;
    branchArcs.forEach(arc => {
      const midAngle = (arc.startAngle + arc.endAngle) / 2 - Math.PI / 2;
      const lx = seasonLabelR * Math.cos(midAngle);
      const ly = seasonLabelR * Math.sin(midAngle);
      const phaseLabel = PHASE_LABELS[arc.phase] || '';
      let rotation = (midAngle * 180 / Math.PI) + 90;
      if (rotation > 90 && rotation < 270) rotation += 180;

      seasonGroup.append('text')
        .attr('x', lx).attr('y', ly)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('transform', `rotate(${rotation}, ${lx}, ${ly})`)
        .attr('fill', '#fff')
        .attr('font-size', phaseLabel === 'TRANSITION'
          ? Math.max(6, (seasonOuter - seasonInner) * 0.35)
          : Math.max(7, (seasonOuter - seasonInner) * 0.40))
        .attr('font-weight', 700)
        .attr('letter-spacing', '0.5px')
        .attr('pointer-events', 'none')
        .style('text-shadow', '0 1px 3px rgba(0,0,0,0.7)')
        .text(phaseLabel);
    });

    // 3D outer rim — chrome lip of the roulette wheel
    seasonGroup.append('circle')
      .attr('r', (seasonInner + seasonOuter) / 2)
      .attr('fill', 'none')
      .attr('stroke', 'url(#outerCurve3D)')
      .attr('stroke-width', seasonOuter - seasonInner)
      .attr('pointer-events', 'none');
    // Outer chrome highlight ring (the polished rim)
    seasonGroup.append('circle')
      .attr('r', seasonOuter)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(200,220,240,0.3)')
      .attr('stroke-width', 1.5)
      .attr('pointer-events', 'none');
    // Inner highlight
    seasonGroup.append('circle')
      .attr('r', seasonInner + 0.5)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', 0.5)
      .attr('pointer-events', 'none');

    // =====================================================================
    // 8. CARDINAL DIAMOND MARKERS
    // =====================================================================
    // Diamond markers at season BOUNDARIES (0°, 90°, 180°, 270°)
    const boundaryPoints = [
      { angle: 0,   season: 'Spring', color: '#4ade80' },
      { angle: 90,  season: 'Summer', color: '#fbbf24' },
      { angle: 180, season: 'Autumn', color: '#f97316' },
      { angle: 270, season: 'Winter', color: '#94a3b8' },
    ];

    const cardinalGroup = g.append('g').attr('class', 'cardinal-markers');
    const diamondDist = seasonOuter + 10;
    const ds = 9;

    boundaryPoints.forEach(pt => {
      const rad = (pt.angle - 90) * Math.PI / 180;
      const dx = diamondDist * Math.cos(rad);
      const dy2 = diamondDist * Math.sin(rad);

      cardinalGroup.append('path')
        .attr('d', `M ${dx} ${dy2 - ds} L ${dx + ds * 0.65} ${dy2} L ${dx} ${dy2 + ds} L ${dx - ds * 0.65} ${dy2} Z`)
        .attr('fill', pt.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
        .attr('cursor', 'pointer')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))')
        .on('mouseover', function () {
          d3.select(this).transition().duration(120)
            .attr('opacity', 1)
            .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))');
          onSeasonMarkerHover(pt.season);
        })
        .on('mouseout', function () {
          d3.select(this).transition().duration(120)
            .attr('opacity', 0.9)
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))');
          onSeasonMarkerHover(null);
        });
    });

    // Season labels at season CENTER (45°, 135°, 225°, 315°)
    // Long line → circle dot → big text, matching Tropical Seasons page
    const seasonLabelData = [
      { angle: 45,  season: 'Spring', color: '#4ade80', icon: '🌸' },
      { angle: 135, season: 'Summer', color: '#fbbf24', icon: '☀️' },
      { angle: 225, season: 'Autumn', color: '#f97316', icon: '🍂' },
      { angle: 315, season: 'Winter', color: '#94a3b8', icon: '❄️' },
    ];

    const seasonLabelGroup = g.append('g').attr('class', 'season-labels-external');
    const pointerStart = seasonOuter + 2;
    const pointerEnd = totalRadius + 45;
    const labelDist = pointerEnd + 14;

    seasonLabelData.forEach(sl => {
      const rad = (sl.angle - 90) * Math.PI / 180;
      const isHl = highlightedSeason === sl.season;

      // Long pointer line
      seasonLabelGroup.append('line')
        .attr('x1', Math.cos(rad) * pointerStart)
        .attr('y1', Math.sin(rad) * pointerStart)
        .attr('x2', Math.cos(rad) * pointerEnd)
        .attr('y2', Math.sin(rad) * pointerEnd)
        .attr('stroke', isHl ? '#fbbf24' : sl.color)
        .attr('stroke-width', isHl ? 2.5 : 1.5)
        .attr('opacity', 0.6);

      // Circle dot at end of line
      seasonLabelGroup.append('circle')
        .attr('cx', Math.cos(rad) * pointerEnd)
        .attr('cy', Math.sin(rad) * pointerEnd)
        .attr('r', isHl ? 5 : 4)
        .attr('fill', isHl ? '#fbbf24' : sl.color)
        .attr('opacity', 1)
        .attr('cursor', 'pointer')
        .on('click', () => onSeasonClick(sl.season));

      // Season label text
      seasonLabelGroup.append('text')
        .attr('x', Math.cos(rad) * labelDist)
        .attr('y', Math.sin(rad) * labelDist)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', isHl ? 15 : 13)
        .attr('font-weight', isHl ? 700 : 600)
        .attr('fill', isHl ? '#fbbf24' : sl.color)
        .attr('cursor', 'pointer')
        .style('text-shadow', isHl
          ? '0 0 10px rgba(251,191,36,0.5)'
          : '0 1px 3px rgba(0,0,0,0.7)')
        .on('click', () => onSeasonClick(sl.season))
        .text(`${sl.icon} ${sl.season}`);
    });

    // =====================================================================
    // 9–10. PILLAR HIGHLIGHT — single white-bordered slice + marker
    // =====================================================================
    if (pillarBranches) {
      const PILLAR_COLORS: Record<string, string> = {
        year:  '#fbbf24',
        month: '#2dd4bf',
        day:   '#c084fc',
        hour:  '#f472b6',
      };
      const PILLAR_LABELS: Record<string, string> = { year: 'Y', month: 'M', day: 'D', hour: 'H' };

      // If a branch is locked (user clicked), highlight THAT branch.
      // Otherwise highlight the date-computed pillar branch.
      const pillarBranchIndex = Object.values(pillarBranches).find((v): v is number => v !== undefined);
      const activeBranch = lockedBranch !== null ? lockedBranch : pillarBranchIndex;

      if (activeBranch !== undefined && activeBranch !== null) {
        // White border across entire slice (stem ring → season ring)
        const sliceArcGen = d3.arc<BranchWheelArc>()
          .innerRadius(stemInner)
          .outerRadius(seasonOuter)
          .startAngle(d => d.startAngle)
          .endAngle(d => d.endAngle)
          .padAngle(0.005)
          .cornerRadius(2);

        const activeArc = branchArcs.find(a => a.branchIndex === activeBranch);
        if (activeArc) {
          g.append('path')
            .datum(activeArc)
            .attr('d', sliceArcGen as any)
            .attr('fill', 'none')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2.5)
            .attr('pointer-events', 'none')
            .attr('opacity', 0.9);
        }
      }

      // Pillar marker dot — always on the date-computed branch
      if (pillarBranchIndex !== undefined) {
        const markerR = animalOuter + 6;
        const [pillarKey] = Object.entries(pillarBranches).find(([, v]) => v !== undefined) || [];
        if (pillarKey) {
          const markerArc = branchArcs.find(a => a.branchIndex === pillarBranchIndex);
          if (markerArc) {
            const midA = (markerArc.startAngle + markerArc.endAngle) / 2 - Math.PI / 2;
            const mx = Math.cos(midA) * markerR;
            const my = Math.sin(midA) * markerR;
            const color = PILLAR_COLORS[pillarKey];

            g.append('circle')
              .attr('cx', mx).attr('cy', my)
              .attr('r', 8)
              .attr('fill', color + '30')
              .attr('stroke', color)
              .attr('stroke-width', 1.5)
              .attr('pointer-events', 'none');

            g.append('text')
              .attr('x', mx).attr('y', my)
              .attr('text-anchor', 'middle')
              .attr('dominant-baseline', 'central')
              .attr('font-size', 9)
              .attr('font-weight', 800)
              .attr('fill', color)
              .attr('pointer-events', 'none')
              .attr('filter', 'drop-shadow(0 0 2px rgba(0,0,0,0.8))')
              .text(PILLAR_LABELS[pillarKey]);
          }
        }
      }
    }

  }, [
    dimensions, branchArcs, hiddenStemArcs, seasonArcs, stemWheelArcs,
    selectedBranch, hoveredBranch, highlightedElement, highlightedSeason,
    currentYear, pillarMode, lockedBranch, monthLabels, dayLabels, hourLabels,
    pillarBranches,
    onBranchClick, onBranchHover, onSeasonClick, onHiddenStemHover,
    onSeasonMarkerHover, onStemNavigate,
  ]);

  // ==========================================================================
  // ROULETTE BALL ANIMATION — physics-based spin in overlay SVG
  // ==========================================================================
  useEffect(() => {
    if (!ballSvgRef.current) return;

    const bsvg = d3.select(ballSvgRef.current);

    // spinTrigger === 0 → RESET: clear everything
    if (spinTrigger === 0) {
      cancelAnimationFrame(ballAnimRef.current);
      bsvg.selectAll('*').remove();
      return;
    }

    const { width, height } = dimensions;
    if (!width || !height) return;

    // Clear previous ball (re-spin case)
    cancelAnimationFrame(ballAnimRef.current);
    bsvg.selectAll('*').remove();

    const totalRadius = Math.min(width, height) / 2 - 15;
    const seasonOuter = totalRadius * 0.88;
    const stemOuter = totalRadius * 0.24;
    const animalInner = totalRadius * 0.34;
    const hsInner = totalRadius * 0.52 + 2;
    const hsOuter = totalRadius * 0.77;
    const gapMidR = (stemOuter + animalInner) / 2;
    const rimR = seasonOuter - 4;
    const hsMidR = (hsInner + hsOuter) / 2;
    const pocketR = gapMidR;

    const cxSvg = width / 2;
    const cySvg = height / 2;

    // Pick random landing position
    const targetDisplayPos = Math.floor(Math.random() * 12);
    const WHEEL_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
    const targetBranchIndex = WHEEL_ORDER[targetDisplayPos];
    const targetAngle = (targetDisplayPos * 30 + 15) * Math.PI / 180;

    // Animation parameters — 30s total, VISIBLE at all times
    // Fewer total revolutions so the ball never outruns the eye
    const rimRevolutions = 1.5 + Math.random() * 0.5;    // 1.5–2 laps on rim
    const hsRevolutions = 1.5 + Math.random() * 0.5;     // 1.5–2 laps on hidden stems
    const gapRevolutions = 3 + Math.random();             // 3–4 laps in the gap zone
    const settleRevolutions = 0.5 + Math.random() * 0.3;  // settling
    const totalRevolutions = rimRevolutions + hsRevolutions + gapRevolutions + settleRevolutions;
    const totalTheta = totalRevolutions * 2 * Math.PI + targetAngle;
    const DURATION = 30000;

    const dropAngle = Math.random() * 2 * Math.PI;

    bsvg.attr('width', width).attr('height', height);
    const bg = bsvg.append('g').attr('transform', `translate(${cxSvg},${cySvg})`);

    // ---- Defs: gradients & filters ----
    const bdefs = bsvg.insert('defs', ':first-child');

    const ballGrad = bdefs.append('radialGradient')
      .attr('id', 'ballChrome')
      .attr('cx', '32%').attr('cy', '28%').attr('r', '68%');
    ballGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff');
    ballGrad.append('stop').attr('offset', '25%').attr('stop-color', '#f0f0f0');
    ballGrad.append('stop').attr('offset', '70%').attr('stop-color', '#b0b0b0');
    ballGrad.append('stop').attr('offset', '100%').attr('stop-color', '#707070');

    // Golden trail gradient
    const goldTrailGrad = bdefs.append('radialGradient')
      .attr('id', 'goldTrail')
      .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    goldTrailGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffd700').attr('stop-opacity', '0.6');
    goldTrailGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ffa500').attr('stop-opacity', '0');

    const ballShadowFilter = bdefs.append('filter')
      .attr('id', 'ballShadow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    ballShadowFilter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha').attr('stdDeviation', 2.5).attr('result', 'blur');
    ballShadowFilter.append('feOffset')
      .attr('in', 'blur').attr('dx', 1.5).attr('dy', 2).attr('result', 'shifted');
    ballShadowFilter.append('feFlood')
      .attr('flood-color', 'rgba(0,0,0,0.55)').attr('result', 'color');
    ballShadowFilter.append('feComposite')
      .attr('in', 'color').attr('in2', 'shifted').attr('operator', 'in').attr('result', 'shadow');
    const bMerge = ballShadowFilter.append('feMerge');
    bMerge.append('feMergeNode').attr('in', 'shadow');
    bMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const glowFilter = bdefs.append('filter')
      .attr('id', 'ballGlow')
      .attr('x', '-100%').attr('y', '-100%')
      .attr('width', '300%').attr('height', '300%');
    glowFilter.append('feGaussianBlur')
      .attr('in', 'SourceGraphic').attr('stdDeviation', 6);

    // Winning segment glow filter (for landing highlight)
    const winGlow = bdefs.append('filter')
      .attr('id', 'winGlow')
      .attr('x', '-50%').attr('y', '-50%')
      .attr('width', '200%').attr('height', '200%');
    winGlow.append('feGaussianBlur')
      .attr('in', 'SourceGraphic').attr('stdDeviation', 4);

    // ---- Golden trail elements ----
    const TRAIL_COUNT = 8;
    const trails: d3.Selection<SVGCircleElement, unknown, null, undefined>[] = [];
    for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
      trails.push(
        bg.append('circle')
          .attr('r', 7 - i * 0.6)
          .attr('fill', i < 3 ? `rgba(255,215,0,${0.35 - i * 0.08})` : `rgba(255,165,0,${0.2 - (i - 3) * 0.035})`)
          .attr('pointer-events', 'none') as any
      );
    }

    // ---- Entrance flash ----
    const dropX = (rimR + 20) * Math.cos(dropAngle - Math.PI / 2);
    const dropY = (rimR + 20) * Math.sin(dropAngle - Math.PI / 2);
    const entranceGlow = bg.append('circle')
      .attr('cx', dropX).attr('cy', dropY)
      .attr('r', 18)
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('filter', 'url(#ballGlow)')
      .attr('pointer-events', 'none');
    entranceGlow.transition().duration(600)
      .attr('r', 30).attr('opacity', 0).remove();

    // Shadow
    const shadow = bg.append('circle')
      .attr('r', 5)
      .attr('fill', 'rgba(0,0,0,0.35)')
      .attr('pointer-events', 'none');

    // Main ball
    const BALL_R = 7;
    const ball = bg.append('circle')
      .attr('r', BALL_R)
      .attr('fill', 'url(#ballChrome)')
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 0.8)
      .attr('filter', 'url(#ballShadow)')
      .attr('pointer-events', 'none');

    // ---- Physics — 6 phases over 30 seconds ----
    // P0: 0–0.02    Drop from outside onto rim (entrance)        ~0.6s
    // P1: 0.02–0.12 Rim orbit (outer edge)                       ~3s
    // P2: 0.12–0.22 Spiral descent: rim → hidden stems           ~3s
    // P3: 0.22–0.40 Hidden stems orbit (2.5+ laps)               ~5.4s
    // P4: 0.40–0.82 Gap area orbit (5+ laps, settling inward)    ~12.6s
    // P5: 0.82–1.0  Final settle into pocket (damped bounce)     ~5.4s
    const P0 = 0.02, P1 = 0.12, P2 = 0.22, P3 = 0.40, P4 = 0.82;
    const entryR = rimR + 25;

    // Radius just outside the gap — ball orbits between animal ring inner and stem outer
    const gapOuterOrbit = animalInner - 2;
    const gapInnerOrbit = stemOuter + 4;

    function getAngle(t: number): number {
      // Slow-start, slow-end sigmoid: ball accelerates gently, peaks mid-spin,
      // then decelerates into the settle. Always visible.
      // Using smoothstep: 3t² - 2t³  (starts at 0 velocity, ends at 0 velocity)
      // Blend with slight linear component so it doesn't fully stop at the end
      const smooth = t * t * (3 - 2 * t);       // 0→1, slow start + slow end
      const eased = 0.85 * smooth + 0.15 * t;   // slight linear blend keeps it moving
      return dropAngle + totalTheta * eased;
    }

    function getAngularSpeed(t: number): number {
      // Derivative of the easing: 0.85*(6t - 6t²) + 0.15
      const dSmooth = 6 * t * (1 - t);
      return totalTheta * (0.85 * dSmooth + 0.15) / DURATION;
    }

    function getRadius(t: number): number {
      if (t < P0) {
        // P0: Drop from outside onto rim
        const p = t / P0;
        const eased = 1 - Math.pow(1 - p, 2);
        return entryR - (entryR - rimR) * eased;

      } else if (t < P1) {
        // P1: Rim orbit with vibration
        const localT = (t - P0) / (P1 - P0);
        const vibration = 1.8 * Math.sin(localT * 60) * (1 - localT);
        return rimR + vibration;

      } else if (t < P2) {
        // P2: Spiral descent — rim → hidden stems
        const p = (t - P1) / (P2 - P1);
        const eased = p * p;
        const base = rimR - (rimR - hsMidR) * eased;
        const bump = 5 * (1 - p) * Math.sin(p * Math.PI * 5);
        return base + bump;

      } else if (t < P3) {
        // P3: Hidden stems orbit — 1.5 laps, drift inward
        const p = (t - P2) / (P3 - P2);
        const drift = (hsOuter - hsInner) * 0.5 * p;
        const wobble = 3 * (1 - p * 0.7) * Math.sin(p * Math.PI * 12);
        return hsMidR - drift + wobble;

      } else if (t < P4) {
        // P4: Gap area orbit — 3+ laps circling in the black gap zone!
        const p = (t - P3) / (P4 - P3);
        // Drop from HS inner into gap area quickly, then orbit
        if (p < 0.12) {
          // Quick fall into gap zone
          const fallP = p / 0.12;
          const eased = fallP * fallP;
          const base = hsInner - (hsInner - gapOuterOrbit) * eased;
          const bump = 4 * (1 - fallP) * Math.sin(fallP * Math.PI * 3);
          return base + bump;
        } else {
          // Orbit in gap zone — slowly spiraling inward
          const orbitP = (p - 0.12) / 0.88;
          const currentR = gapOuterOrbit - (gapOuterOrbit - gapInnerOrbit) * orbitP * orbitP;
          // Rattling wobble against pocket walls
          const wobbleAmp = 4 * (1 - orbitP * 0.8);
          const wobble = wobbleAmp * Math.sin(orbitP * Math.PI * 22);
          // Occasional bump (ball hitting pocket edges)
          const bumpAmp = 2.5 * Math.max(0, 1 - orbitP * 1.3);
          const bump = bumpAmp * Math.abs(Math.sin(orbitP * Math.PI * 8));
          return currentR + wobble + bump;
        }

      } else {
        // P5: Final settle into pocket — damped harmonic bounce
        const p = (t - P4) / (1 - P4);
        const dampingFactor = Math.exp(-p * 6);
        const bounceAmp = 10 * dampingFactor;
        const bounce = bounceAmp * Math.abs(Math.sin(p * Math.PI * 6));
        return pocketR + bounce;
      }
    }

    // ---- Spark particles emitter ----
    function emitSparks(cx: number, cy: number, count: number, color: string, maxR: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 8 + Math.random() * maxR;
        const tx = cx + dist * Math.cos(angle);
        const ty = cy + dist * Math.sin(angle);
        const spark = bg.append('circle')
          .attr('cx', cx).attr('cy', cy)
          .attr('r', 1 + Math.random() * 2)
          .attr('fill', color)
          .attr('opacity', 0.9)
          .attr('pointer-events', 'none');
        spark.transition()
          .duration(400 + Math.random() * 400)
          .ease(d3.easeCubicOut)
          .attr('cx', tx).attr('cy', ty)
          .attr('r', 0.3)
          .attr('opacity', 0)
          .remove();
      }
    }

    // ---- Expanding ring pulse ----
    function emitRing(cx: number, cy: number, color: string, maxR: number, dur: number) {
      const ring = bg.append('circle')
        .attr('cx', cx).attr('cy', cy)
        .attr('r', 4)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('opacity', 0.8)
        .attr('pointer-events', 'none');
      ring.transition().duration(dur)
        .ease(d3.easeCubicOut)
        .attr('r', maxR)
        .attr('stroke-width', 0.5)
        .attr('opacity', 0)
        .remove();
    }

    const startTime = performance.now();
    let lastSparkT = 0;

    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION, 1);

      const angle = getAngle(t) - Math.PI / 2;
      const r = getRadius(t);
      const speed = getAngularSpeed(t);

      const bx = r * Math.cos(angle);
      const by = r * Math.sin(angle);
      ball.attr('cx', bx).attr('cy', by);

      // Shadow
      const shadowOff = 1.5 + (r - pocketR) / (rimR - pocketR) * 1.5;
      shadow.attr('cx', bx + shadowOff).attr('cy', by + shadowOff);

      // Golden trail — visible when ball is moving (middle 90% of animation)
      const moving = t > 0.03 && t < 0.95;
      const trailSpacing = Math.min(0.06, 0.008 + speed * 800);
      trails.forEach((trail, i) => {
        const trailAngle = angle - (i + 1) * trailSpacing;
        const trailR = r + i * 0.2;
        trail.attr('cx', trailR * Math.cos(trailAngle))
             .attr('cy', trailR * Math.sin(trailAngle))
             .attr('opacity', moving ? (0.3 - i * 0.03) : 0);
      });

      // Emit sparks when ball is in gap zone (P4) or bouncing fast
      if (t > P3 && t < P4 && t - lastSparkT > 0.025) {
        lastSparkT = t;
        emitSparks(bx, by, 2, '#ffd700', 15);
      }

      // Bouncing squash effect in settle phase
      if (t > P4) {
        const bounceP = (t - P4) / (1 - P4);
        const squash = 1 + 0.08 * Math.exp(-bounceP * 4) * Math.abs(Math.sin(bounceP * Math.PI * 6));
        ball.attr('r', BALL_R * squash);
      }

      if (t < 1) {
        ballAnimRef.current = requestAnimationFrame(animate);
      } else {
        // ======== LANDED — gaming effects ========
        trails.forEach(tr => tr.attr('opacity', 0));

        // 1) Particle burst
        emitSparks(bx, by, 20, '#ffd700', 35);
        emitSparks(bx, by, 12, '#ffffff', 25);
        emitSparks(bx, by, 8, '#f472b6', 30);

        // 2) Expanding ring pulses (staggered)
        emitRing(bx, by, '#ffd700', 40, 500);
        setTimeout(() => emitRing(bx, by, '#f472b6', 55, 700), 150);
        setTimeout(() => emitRing(bx, by, 'rgba(255,255,255,0.6)', 65, 800), 350);

        // 3) Winning segment glow — highlight the gap pocket arc
        const segStartAngle = (targetDisplayPos * 30 - 90) * Math.PI / 180;
        const segEndAngle = ((targetDisplayPos + 1) * 30 - 90) * Math.PI / 180;
        const arcGen = d3.arc<any>()
          .innerRadius(stemOuter + 1)
          .outerRadius(animalInner - 1)
          .startAngle(segStartAngle + Math.PI / 2)
          .endAngle(segEndAngle + Math.PI / 2);
        const winArc = bg.append('path')
          .attr('d', arcGen({}))
          .attr('fill', 'rgba(255,215,0,0.35)')
          .attr('filter', 'url(#winGlow)')
          .attr('pointer-events', 'none')
          .attr('opacity', 0);
        winArc.transition().duration(400).attr('opacity', 1);
        // Pulse the glow
        function pulseWin() {
          winArc.transition().duration(800).attr('fill', 'rgba(244,114,182,0.3)')
            .transition().duration(800).attr('fill', 'rgba(255,215,0,0.35)')
            .on('end', pulseWin);
        }
        pulseWin();

        // 4) Gold flash on ball
        const flashGlow = bg.append('circle')
          .attr('cx', bx).attr('cy', by)
          .attr('r', 12)
          .attr('fill', 'rgba(251,191,36,0.6)')
          .attr('filter', 'url(#ballGlow)')
          .attr('pointer-events', 'none');
        flashGlow.transition().duration(400)
          .attr('r', 25).attr('opacity', 0).remove();

        // 5) Ball stays — glows gold then settles as persistent chrome ball
        ball.transition().duration(300)
          .attr('fill', '#ffd700').attr('r', BALL_R + 3)
          .transition().duration(500)
          .attr('fill', 'url(#ballChrome)').attr('r', BALL_R);

        // 6) Persistent glow halo around resting ball
        const halo = bg.insert('circle', ':first-child')
          .attr('cx', bx).attr('cy', by)
          .attr('r', BALL_R + 6)
          .attr('fill', 'none')
          .attr('stroke', '#ffd700')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0)
          .attr('pointer-events', 'none');
        halo.transition().duration(500).attr('opacity', 0.6);
        // Gentle pulse on the halo
        function pulseHalo() {
          halo.transition().duration(1200).attr('stroke-width', 2.5).attr('opacity', 0.8)
            .transition().duration(1200).attr('stroke-width', 1.5).attr('opacity', 0.4)
            .on('end', pulseHalo);
        }
        pulseHalo();

        // Report landing
        setTimeout(() => {
          onBallLand?.(targetBranchIndex, targetDisplayPos);
        }, 600);

        // Ball and effects PERSIST until next spin or RESET (no auto-remove)
      }
    }

    ballAnimRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(ballAnimRef.current);
      bsvg.selectAll('*').remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinTrigger]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        ref={svgRef}
        style={{ display: 'block', margin: '0 auto' }}
      />
      <svg
        ref={ballSvgRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
