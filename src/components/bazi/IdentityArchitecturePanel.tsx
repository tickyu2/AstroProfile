/**
 * IdentityArchitecturePanel
 *
 * Heaven\u2013Earth\u2013Human Identity Architecture UI.
 * Seven chapters: Heaven Self, Earth Self, Human Self, Tension Map,
 *                 Cathedral Map, Contradiction Story, Identity Codex.
 *
 * Features:
 *  - Element-coded gradients per chapter
 *  - Pulsing tension lines (CSS animation)
 *  - 3-ring cathedral map (Heaven / Earth / Human concentric rings)
 *  - D3 interactive cathedral ring with hover tooltips
 *  - Identity Codex print-friendly view
 */

import './IdentityArchitecture.css';
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import {
  buildIdentityArchitecture,
  type IdentityArchitecture,
  type HeavenPersonality,
  type EarthPersonality,
  type HumanPersonality,
  type IdentityTension,
  type BaZiPillar,
  type Element,
} from '../../utils/identityArchitecture';
import { ELEMENT_COLORS, HIDDEN_STEMS, type AlignmentData } from '../../utils/baziWheels';

// =============================================================================
// ELEMENT THEME HELPERS
// =============================================================================

const ELEMENT_GRADIENTS: Record<Element, string> = {
  Wood:  'linear-gradient(135deg, rgba(20,83,45,0.35) 0%, rgba(34,197,94,0.12) 100%)',
  Fire:  'linear-gradient(135deg, rgba(127,29,29,0.35) 0%, rgba(239,68,68,0.12) 100%)',
  Earth: 'linear-gradient(135deg, rgba(120,53,15,0.35) 0%, rgba(234,179,8,0.12) 100%)',
  Metal: 'linear-gradient(135deg, rgba(31,41,55,0.4) 0%, rgba(156,163,175,0.12) 100%)',
  Water: 'linear-gradient(135deg, rgba(12,74,110,0.35) 0%, rgba(59,130,246,0.12) 100%)',
};

const ELEMENT_ICONS: Record<Element, string> = {
  Wood: '\u{1F333}', Fire: '\u{1F525}', Earth: '\u26F0\uFE0F', Metal: '\u2699\uFE0F', Water: '\u{1F4A7}',
};

const PILLAR_ROLE_LABELS: Record<string, string> = {
  Year: 'Public Self (0\u201316)',
  Month: 'Work Self (17\u201332)',
  Day: 'True Self (33\u201348)',
  Hour: 'Future Self (49+)',
};

// =============================================================================
// SVG: COHERENCE TRIANGLE
// =============================================================================

const CoherenceTriangle: React.FC<{ coherenceIndex: number }> = ({ coherenceIndex }) => {
  const fillOpacity = 0.15 + (coherenceIndex / 100) * 0.55;
  return (
    <svg viewBox="0 0 200 180" style={{ width: 80, height: 72 }}>
      <polygon points="100,10 10,170 190,170" fill="none" stroke="#64748b" strokeWidth={2} />
      <polygon points="100,40 40,150 160,150" fill="#38bdf8" opacity={fillOpacity} />
      <text x="100" y="22" textAnchor="middle" fontSize="10" fill="#94a3b8">Heaven</text>
      <text x="18" y="168" textAnchor="start" fontSize="10" fill="#94a3b8">Earth</text>
      <text x="182" y="168" textAnchor="end" fontSize="10" fill="#94a3b8">Human</text>
    </svg>
  );
};

// =============================================================================
// SVG: CATHEDRAL RING — now with pulsing tension lines
// =============================================================================

const CathedralRing: React.FC<{
  pillars: BaZiPillar[];
  tensionCount: number;
  coherenceIndex: number;
}> = ({ pillars, tensionCount, coherenceIndex }) => {
  const cx = 150, cy = 150, r = 110;
  const angles = [0, 90, 180, 270];
  const labels = ['Y', 'M', 'D', 'H'];
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  const nodes = pillars.map((p, i) => ({
    x: cx + r * Math.cos(toRad(angles[i])),
    y: cy + r * Math.sin(toRad(angles[i])),
    element: p.stem.element as Element,
    label: labels[i],
  }));

  const tensionPairs: [number, number][] = [];
  if (tensionCount >= 1) tensionPairs.push([0, 2]);
  if (tensionCount >= 2) tensionPairs.push([1, 2]);
  if (tensionCount >= 3) tensionPairs.push([2, 3]);
  if (tensionCount >= 4) tensionPairs.push([0, 3]);

  return (
    <svg viewBox="0 0 300 300" style={{ width: 220, height: 220 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#475569" strokeWidth={2.5} />

      {/* Inner coherence glow — animated */}
      <circle
        cx={cx} cy={cy} r={r - 22}
        fill="#38bdf8"
        className="ia-coherence-glow"
        style={{ opacity: 0.06 + (coherenceIndex / 100) * 0.2 }}
      />

      {/* Harmony lines */}
      {nodes.map((a, i) => {
        const b = nodes[(i + 1) % nodes.length];
        return (
          <line key={`arc-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke="#334155" strokeWidth={1} opacity={0.5}
          />
        );
      })}

      {/* Pulsing tension lines */}
      {tensionPairs.map(([ai, bi], i) => (
        <line key={`t-${i}`}
          className="ia-tension-line"
          x1={nodes[ai].x} y1={nodes[ai].y}
          x2={nodes[bi].x} y2={nodes[bi].y}
          stroke="#ef4444" strokeDasharray="5 3"
        />
      ))}

      {/* Pillar nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={18}
            fill="#0f172a" stroke={ELEMENT_COLORS[n.element] || '#64748b'} strokeWidth={2.5}
          />
          <text x={n.x} y={n.y + 4} textAnchor="middle"
            fontSize="12" fontWeight={700} fill={ELEMENT_COLORS[n.element] || '#94a3b8'}
          >
            {n.label}
          </text>
        </g>
      ))}

      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">Coherence</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fontWeight={700} fill="#e2e8f0">
        {coherenceIndex}%
      </text>
    </svg>
  );
};

// =============================================================================
// SVG: 3-RING CATHEDRAL MAP (Heaven / Earth / Human concentric rings)
// =============================================================================

const ThreeRingCathedral: React.FC<{ pillars: BaZiPillar[] }> = ({ pillars }) => {
  const cx = 160, cy = 160;
  const radii = { heaven: 130, earth: 95, human: 60 };
  const angles = [0, 90, 180, 270];
  const roleLabels = ['Y', 'M', 'D', 'H'];
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

  const ringData = pillars.map((p, i) => {
    const hs = HIDDEN_STEMS[p.branch.index];
    const humanEl = hs?.[0]?.element || p.branch.element;
    return {
      role: roleLabels[i],
      angle: angles[i],
      heaven: p.stem.element,
      earth: p.branch.element,
      human: humanEl,
    };
  });

  return (
    <svg viewBox="0 0 320 320" style={{ width: 260, height: 260 }}>
      {/* Ring circles */}
      <circle cx={cx} cy={cy} r={radii.heaven} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy} r={radii.earth} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy} r={radii.human} fill="none" stroke="#334155" strokeWidth={1.5} strokeDasharray="3 2" />

      {/* Ring labels (center top) */}
      <text x={cx} y={cy - radii.heaven - 6} textAnchor="middle" fontSize="9" fill="#64748b">Heaven</text>
      <text x={cx} y={cy - radii.earth - 6} textAnchor="middle" fontSize="9" fill="#64748b">Earth</text>
      <text x={cx} y={cy - radii.human - 6} textAnchor="middle" fontSize="9" fill="#64748b">Human</text>

      {ringData.map((d, i) => {
        const hx = cx + radii.heaven * Math.cos(toRad(d.angle));
        const hy = cy + radii.heaven * Math.sin(toRad(d.angle));
        const ex = cx + radii.earth * Math.cos(toRad(d.angle));
        const ey = cy + radii.earth * Math.sin(toRad(d.angle));
        const ux = cx + radii.human * Math.cos(toRad(d.angle));
        const uy = cy + radii.human * Math.sin(toRad(d.angle));

        // Connecting spoke line
        return (
          <g key={i} className="ia-ring-node">
            <line x1={hx} y1={hy} x2={ux} y2={uy} stroke="#1e293b" strokeWidth={1} opacity={0.5} />

            {/* Heaven node */}
            <circle cx={hx} cy={hy} r={12}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.heaven] || '#64748b'} strokeWidth={2.5}
            />
            <text x={hx} y={hy + 3.5} textAnchor="middle" fontSize="8" fontWeight={700}
              fill={ELEMENT_COLORS[d.heaven] || '#94a3b8'}
            >
              {d.heaven.charAt(0)}
            </text>

            {/* Earth node */}
            <circle cx={ex} cy={ey} r={10}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.earth] || '#64748b'} strokeWidth={2}
            />
            <text x={ex} y={ey + 3} textAnchor="middle" fontSize="7" fontWeight={600}
              fill={ELEMENT_COLORS[d.earth] || '#94a3b8'}
            >
              {d.earth.charAt(0)}
            </text>

            {/* Human node */}
            <circle cx={ux} cy={uy} r={8}
              fill="#0f172a" stroke={ELEMENT_COLORS[d.human] || '#64748b'} strokeWidth={2}
            />
            <text x={ux} y={uy + 3} textAnchor="middle" fontSize="7" fontWeight={600}
              fill={ELEMENT_COLORS[d.human] || '#94a3b8'}
            >
              {d.human.charAt(0)}
            </text>

            {/* Role label at outer edge */}
            <text
              x={cx + (radii.heaven + 18) * Math.cos(toRad(d.angle))}
              y={cy + (radii.heaven + 18) * Math.sin(toRad(d.angle)) + 4}
              textAnchor="middle" fontSize="11" fontWeight={700} fill="#94a3b8"
            >
              {d.role}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// =============================================================================
// D3 INTERACTIVE CATHEDRAL RING
// =============================================================================

const D3CathedralRing: React.FC<{
  pillars: BaZiPillar[];
  tensionCount: number;
  coherenceIndex: number;
}> = ({ pillars, tensionCount, coherenceIndex }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const w = 300, h = 300;
    const cx = w / 2, cy = h / 2, r = 115;
    const angles = [0, 90, 180, 270];
    const roleNames = ['Year', 'Month', 'Day', 'Hour'];
    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

    const nodes = pillars.map((p, i) => ({
      x: cx + r * Math.cos(toRad(angles[i])),
      y: cy + r * Math.sin(toRad(angles[i])),
      element: p.stem.element,
      branch: p.branch.animal,
      branchEl: p.branch.element,
      role: roleNames[i],
      stemChar: p.stem.char,
      branchChar: p.branch.char,
    }));

    // Outer ring
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', r)
      .attr('fill', 'none').attr('stroke', '#475569').attr('stroke-width', 2.5);

    // Inner coherence glow
    svg.append('circle')
      .attr('cx', cx).attr('cy', cy).attr('r', r - 22)
      .attr('fill', '#38bdf8')
      .attr('opacity', 0.06 + (coherenceIndex / 100) * 0.2);

    // Harmony lines between adjacent pillars
    nodes.forEach((a, i) => {
      const b = nodes[(i + 1) % nodes.length];
      svg.append('line')
        .attr('x1', a.x).attr('y1', a.y).attr('x2', b.x).attr('y2', b.y)
        .attr('stroke', '#334155').attr('stroke-width', 1).attr('opacity', 0.5);
    });

    // Tension lines (pulsing via CSS class)
    const tensionPairs: [number, number][] = [];
    if (tensionCount >= 1) tensionPairs.push([0, 2]);
    if (tensionCount >= 2) tensionPairs.push([1, 2]);
    if (tensionCount >= 3) tensionPairs.push([2, 3]);
    if (tensionCount >= 4) tensionPairs.push([0, 3]);

    for (const [ai, bi] of tensionPairs) {
      svg.append('line')
        .attr('class', 'ia-tension-line')
        .attr('x1', nodes[ai].x).attr('y1', nodes[ai].y)
        .attr('x2', nodes[bi].x).attr('y2', nodes[bi].y)
        .attr('stroke', '#ef4444').attr('stroke-dasharray', '5 3');
    }

    // Center text
    svg.append('text')
      .attr('x', cx).attr('y', cy - 4).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#94a3b8').text('Coherence');
    svg.append('text')
      .attr('x', cx).attr('y', cy + 14).attr('text-anchor', 'middle')
      .attr('font-size', 18).attr('font-weight', 700).attr('fill', '#e2e8f0')
      .text(`${coherenceIndex}%`);

    // Pillar nodes (interactive)
    const nodeGs = svg.selectAll('g.ia-d3-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'ia-d3-node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer');

    nodeGs.append('circle')
      .attr('r', 20)
      .attr('fill', '#0f172a')
      .attr('stroke', d => ELEMENT_COLORS[d.element] || '#64748b')
      .attr('stroke-width', 2.5);

    nodeGs.append('text')
      .attr('text-anchor', 'middle').attr('dy', 5)
      .attr('font-size', 13).attr('font-weight', 700)
      .attr('fill', d => ELEMENT_COLORS[d.element] || '#94a3b8')
      .text(d => d.role[0]);

    // Tooltip interaction
    const tooltip = tooltipRef.current;
    if (tooltip) {
      nodeGs
        .on('mouseenter', function (event, d) {
          const hs = HIDDEN_STEMS[pillars[nodes.indexOf(d)].branch.index];
          const hiddenText = hs
            ? hs.map(h => `${h.char} ${h.element} (${h.percentage}%)`).join(', ')
            : 'None';
          tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:4px;color:${ELEMENT_COLORS[d.element] || '#e2e8f0'}">${d.role} Pillar</div>
            <div>${PILLAR_ROLE_LABELS[d.role] || d.role}</div>
            <div style="margin-top:4px"><b>Heaven:</b> ${d.stemChar} ${d.element}</div>
            <div><b>Earth:</b> ${d.branchChar} ${d.branch} (${d.branchEl})</div>
            <div><b>Hidden:</b> ${hiddenText}</div>
          `;
          tooltip.style.display = 'block';
          tooltip.style.left = `${event.pageX + 12}px`;
          tooltip.style.top = `${event.pageY - 10}px`;

          d3.select(this).select('circle').transition().duration(150).attr('r', 24);
        })
        .on('mousemove', function (event) {
          if (tooltip) {
            tooltip.style.left = `${event.pageX + 12}px`;
            tooltip.style.top = `${event.pageY - 10}px`;
          }
        })
        .on('mouseleave', function () {
          if (tooltip) tooltip.style.display = 'none';
          d3.select(this).select('circle').transition().duration(150).attr('r', 20);
        });
    }
  }, [pillars, tensionCount, coherenceIndex]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} viewBox="0 0 300 300" style={{ width: 280, height: 280 }} />
      <div ref={tooltipRef} className="ia-d3-tooltip" style={{ display: 'none' }} />
    </div>
  );
};

// =============================================================================
// IDENTITY CODEX — print-friendly / PDF-style layout
// =============================================================================

const IdentityCodex: React.FC<{
  identity: IdentityArchitecture;
  pillars: BaZiPillar[];
}> = ({ identity, pillars }) => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="ia-codex">
      <div className="ia-codex-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.03em' }}>
              Identity Codex \u2014 Heaven \u00B7 Earth \u00B7 Human
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              A structural and narrative reading of your BaZi identity architecture.
            </div>
          </div>
          <button
            onClick={handlePrint}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(139, 92, 246, 0.1)',
              color: '#a78bfa', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Print / PDF
          </button>
        </div>
      </div>

      <div className="ia-codex-body">
        {/* Left: narrative + three selves */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Contradiction story */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
              Contradiction Story
            </div>
            <div style={{
              fontSize: '12px', lineHeight: 1.8, color: '#cbd5e1', whiteSpace: 'pre-line',
            }}>
              {identity.contradictionNarrative}
            </div>
          </div>

          {/* Three selves grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <CodexSelfCard
              title="Heaven Self"
              icon={ELEMENT_ICONS[identity.heavenPersonality.dominant]}
              element={identity.heavenPersonality.dominant}
              lines={[
                identity.heavenPersonality.cognitiveStyle,
                identity.heavenPersonality.worldview,
              ]}
            />
            <CodexSelfCard
              title="Earth Self"
              icon={ELEMENT_ICONS[identity.earthPersonality.dominant]}
              element={identity.earthPersonality.dominant}
              lines={[
                identity.earthPersonality.instincts,
                identity.earthPersonality.stressBehaviors,
              ]}
            />
            <CodexSelfCard
              title="Human Self"
              icon={ELEMENT_ICONS[identity.humanPersonality.dominant]}
              element={identity.humanPersonality.dominant}
              lines={[
                identity.humanPersonality.emotionalNeeds,
                identity.humanPersonality.shadowDesires,
              ]}
            />
          </div>

          {/* Tensions summary */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
              Key Tensions
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <CodexTensionList title="Elemental" items={identity.identityTension.elementalConflicts} />
              <CodexTensionList title="Role" items={identity.identityTension.roleConflicts} />
              <CodexTensionList title="Subconscious" items={identity.identityTension.subconsciousConflicts} />
            </div>
          </div>
        </div>

        {/* Right sidebar: scores + 3-ring cathedral */}
        <div className="ia-codex-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0' }}>
                {identity.alignmentScore}/12
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Alignment</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#e2e8f0' }}>
                {identity.internalCoherenceIndex}%
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Coherence</div>
            </div>
          </div>
          <ThreeRingCathedral pillars={pillars} />
          <CoherenceTriangle coherenceIndex={identity.internalCoherenceIndex} />
        </div>
      </div>

      <div className="ia-codex-footer">
        Identity Codex \u2014 Heaven\u2013Earth\u2013Human Architecture \u00B7 Generated from BaZi Chart
      </div>
    </div>
  );
};

const CodexSelfCard: React.FC<{
  title: string; icon: string; element: Element; lines: string[];
}> = ({ title, icon, element, lines }) => (
  <div style={{
    background: ELEMENT_GRADIENTS[element],
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '10px 12px',
  }}>
    <div style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
      {icon} {title}
    </div>
    {lines.map((l, i) => (
      <div key={i} style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '4px' }}>{l}</div>
    ))}
  </div>
);

const CodexTensionList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>{title}</div>
    {items.length === 0 ? (
      <div style={{ fontSize: '10px', color: '#475569', fontStyle: 'italic' }}>None</div>
    ) : (
      items.map((t, i) => (
        <div key={i} style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '3px' }}>
          \u2022 {t}
        </div>
      ))
    )}
  </div>
);

// =============================================================================
// CHAPTER SHELL
// =============================================================================

const ChapterShell: React.FC<{
  title: string;
  subtitle: string;
  footer: string;
  gradient?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, footer, gradient, children }) => (
  <div style={{
    background: gradient || 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '18px 20px',
  }}>
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color: '#f1f5f9' }}>{title}</div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{subtitle}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {children}
    </div>
    <div style={{ marginTop: '14px', fontSize: '11px', fontStyle: 'italic', color: '#64748b' }}>
      {footer}
    </div>
  </div>
);

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{value}</div>
  </div>
);

const BulletList: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>{label}</div>
    <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
      {items.map((s, i) => (
        <li key={i} style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{s}</li>
      ))}
    </ul>
  </div>
);

// =============================================================================
// CHAPTERS 1\u20135 (unchanged logic, same as before)
// =============================================================================

const HeavenSelfChapter: React.FC<{ data: HeavenPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Heaven Self \u2014 The Mind Above`}
    subtitle="Your worldview, cognition, and conscious identity."
    footer="Your Heaven Self is the strategist who stands on the mountain, reading the winds."
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Cognitive Style" value={data.cognitiveStyle} />
    <Field label="Worldview Lens" value={data.worldview} />
    <Field label="Decision Logic" value={data.decisionLogic} />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <BulletList label="Strengths" items={data.strengths} />
      <BulletList label="Blind Spots" items={data.blindSpots} />
    </div>
  </ChapterShell>
);

const EarthSelfChapter: React.FC<{ data: EarthPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Earth Self \u2014 The Body Below`}
    subtitle="Your instincts, habits, and somatic intelligence."
    footer="Your Earth Self is the animal within \u2014 the one who reacts before thought."
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Instinctive Pattern" value={data.instincts} />
    <Field label="Stress Behavior" value={data.stressBehaviors} />
    <Field label="Habit Loops" value={data.habits} />
    <Field label="Somatic Patterns" value={data.somaticPatterns} />
  </ChapterShell>
);

const HumanSelfChapter: React.FC<{ data: HumanPersonality }> = ({ data }) => (
  <ChapterShell
    title={`${ELEMENT_ICONS[data.dominant]} Human Self \u2014 The Heart Within`}
    subtitle="Your emotional needs, motivations, and shadow desires."
    footer="Your Human Self is the quiet voice inside \u2014 the one that remembers your true longing."
    gradient={ELEMENT_GRADIENTS[data.dominant]}
  >
    <Field label="Emotional Needs" value={data.emotionalNeeds} />
    <Field label="Motivational Drivers" value={data.motivations} />
    <Field label="Shadow Desires" value={data.shadowDesires} />
    <Field label="Subconscious Fears" value={data.subconsciousFears} />
  </ChapterShell>
);

const TensionMapChapter: React.FC<{
  data: IdentityTension;
  alignmentScore: number;
  coherenceIndex: number;
  pillars: BaZiPillar[];
}> = ({ data, alignmentScore, coherenceIndex, pillars }) => {
  const totalTensions =
    data.elementalConflicts.length + data.roleConflicts.length + data.subconsciousConflicts.length;

  return (
    <ChapterShell
      title="\u26A1 Tension Map \u2014 Where the Selves Disagree"
      subtitle="Elemental conflicts, role contradictions, subconscious friction."
      footer="The Tension Map shows the fault lines where your inner world reshapes itself."
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <CathedralRing pillars={pillars} tensionCount={totalTensions} coherenceIndex={coherenceIndex} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0' }}>{alignmentScore}/12</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Alignment Score</div>
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#e2e8f0' }}>{coherenceIndex}%</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Internal Coherence</div>
            </div>
          </div>
          <CoherenceTriangle coherenceIndex={coherenceIndex} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <TensionColumn title="Elemental Conflicts" items={data.elementalConflicts} fallback="No major elemental conflicts detected." />
        <TensionColumn title="Role Conflicts" items={data.roleConflicts} fallback="Roles are mostly aligned." />
        <TensionColumn title="Subconscious Conflicts" items={data.subconsciousConflicts} fallback="Conscious and subconscious largely in sync." />
      </div>
    </ChapterShell>
  );
};

const TensionColumn: React.FC<{ title: string; items: string[]; fallback: string }> = ({ title, items, fallback }) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>{title}</div>
    {items.length === 0 ? (
      <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>{fallback}</div>
    ) : (
      <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
        {items.map((t, i) => (
          <li key={i} style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '4px' }}>{t}</li>
        ))}
      </ul>
    )}
  </div>
);

// =============================================================================
// NEW CHAPTER 5: CATHEDRAL MAP (3-Ring + D3 Interactive)
// =============================================================================

const CathedralMapChapter: React.FC<{
  pillars: BaZiPillar[];
  tensionCount: number;
  coherenceIndex: number;
}> = ({ pillars, tensionCount, coherenceIndex }) => (
  <ChapterShell
    title="\u{1F3DB}\uFE0F Cathedral Map \u2014 The Three Rings"
    subtitle="Heaven (outer), Earth (middle), Human (inner) \u2014 four pillars at each layer."
    footer="The Cathedral Map reveals the sacred geometry of your three selves across all four pillars."
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
          3-Ring Structure
        </div>
        <ThreeRingCathedral pillars={pillars} />
        <div style={{ fontSize: '10px', color: '#475569', marginTop: '4px' }}>
          Outer = Stem \u00B7 Middle = Branch \u00B7 Inner = Hidden Stem
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
          Interactive Ring (hover for details)
        </div>
        <D3CathedralRing pillars={pillars} tensionCount={tensionCount} coherenceIndex={coherenceIndex} />
      </div>
    </div>
  </ChapterShell>
);

// =============================================================================
// CHAPTER 6: CONTRADICTION STORY (renumbered from 5)
// =============================================================================

const ContradictionStoryChapter: React.FC<{ narrative: string }> = ({ narrative }) => (
  <ChapterShell
    title="\u{1F300} Contradiction Story \u2014 The Myth of Your Inner World"
    subtitle="A narrative that weaves all tensions into a coherent arc."
    footer="Your contradictions are not flaws \u2014 they are the architecture of your becoming."
    gradient="linear-gradient(135deg, rgba(30,41,59,0.5) 0%, rgba(51,65,85,0.3) 100%)"
  >
    <div style={{ fontSize: '13px', lineHeight: 1.8, color: '#cbd5e1', whiteSpace: 'pre-line' }}>
      {narrative}
    </div>
  </ChapterShell>
);

// =============================================================================
// CHAPTER NAV + STORYBOOK LAYOUT (expanded to 7 chapters)
// =============================================================================

const CHAPTERS = [
  'Heaven Self',
  'Earth Self',
  'Human Self',
  'Tension Map',
  'Cathedral Map',
  'Contradiction Story',
  'Identity Codex',
] as const;

const IdentityStorybook: React.FC<{
  identity: IdentityArchitecture;
  pillars: BaZiPillar[];
}> = ({ identity, pillars }) => {
  const [idx, setIdx] = useState(0);

  const totalTensions =
    identity.identityTension.elementalConflicts.length +
    identity.identityTension.roleConflicts.length +
    identity.identityTension.subconsciousConflicts.length;

  const go = (i: number) => { if (i >= 0 && i < CHAPTERS.length) setIdx(i); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '6px 10px',
      }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {CHAPTERS.map((label, i) => (
            <button
              key={label}
              onClick={() => go(i)}
              style={{
                padding: '5px 10px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: i === idx ? 700 : 500,
                background: i === idx ? 'rgba(248,250,252,0.9)' : 'rgba(51,65,85,0.5)',
                color: i === idx ? '#0f172a' : '#94a3b8',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <NavBtn label="\u2039 Prev" onClick={() => go(idx - 1)} disabled={idx === 0} />
          <NavBtn label="Next \u203A" onClick={() => go(idx + 1)} disabled={idx === CHAPTERS.length - 1} />
        </div>
      </div>

      {/* Chapter content */}
      {idx === 0 && <HeavenSelfChapter data={identity.heavenPersonality} />}
      {idx === 1 && <EarthSelfChapter data={identity.earthPersonality} />}
      {idx === 2 && <HumanSelfChapter data={identity.humanPersonality} />}
      {idx === 3 && (
        <TensionMapChapter
          data={identity.identityTension}
          alignmentScore={identity.alignmentScore}
          coherenceIndex={identity.internalCoherenceIndex}
          pillars={pillars}
        />
      )}
      {idx === 4 && (
        <CathedralMapChapter
          pillars={pillars}
          tensionCount={totalTensions}
          coherenceIndex={identity.internalCoherenceIndex}
        />
      )}
      {idx === 5 && <ContradictionStoryChapter narrative={identity.contradictionNarrative} />}
      {idx === 6 && <IdentityCodex identity={identity} pillars={pillars} />}
    </div>
  );
};

const NavBtn: React.FC<{ label: string; onClick: () => void; disabled: boolean }> = ({ label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '4px 8px',
      borderRadius: '14px',
      border: 'none',
      cursor: disabled ? 'default' : 'pointer',
      fontSize: '11px',
      background: 'transparent',
      color: disabled ? '#334155' : '#94a3b8',
      opacity: disabled ? 0.4 : 1,
    }}
  >
    {label}
  </button>
);

// =============================================================================
// TOP-LEVEL PANEL
// =============================================================================

const IdentityArchitecturePanel: React.FC<{
  pillars: BaZiPillar[];
  alignments: AlignmentData[];
}> = ({ pillars, alignments }) => {
  const identity = useMemo(
    () => buildIdentityArchitecture(pillars, alignments),
    [pillars, alignments],
  );

  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(139, 92, 246, 0.06)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px',
            color: '#a78bfa',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '16px' }}>{'\u{1F3DB}\uFE0F'}</span>
          Heaven\u2013Earth\u2013Human Identity Architecture
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>
            Click to explore
          </span>
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.15)',
      borderRadius: '16px',
      padding: '16px 20px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
      }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
            {'\u{1F3DB}\uFE0F'} Heaven\u2013Earth\u2013Human Identity Architecture
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
            A psychological reading of your BaZi chart\u2019s three selves and their tensions.
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'none', border: 'none', color: '#64748b',
            fontSize: '18px', cursor: 'pointer', padding: '4px 8px',
          }}
        >
          \u2715
        </button>
      </div>

      <IdentityStorybook identity={identity} pillars={pillars} />
    </div>
  );
};

export default IdentityArchitecturePanel;
