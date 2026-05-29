/**
 * QiPipelineFlow — React Flow diagram showing the entire Qi-physics pipeline.
 * Supports educationMode prop for animated Qi-particle edges + node tooltips.
 */
import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BaseEdge,
  getStraightPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ─── Pipeline Nodes ─────────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  // ── Row 0: TFQ Soul Baseline ──
  { id: 'tfq',       label: 'TFQ\n(Soul Baseline)',           x: 250,  y: 0,   color: '#6366f1',
    tip: 'Total Functional Qi — raw Qi from stems + branches + hidden stems, weighted by pillar position. Who you ARE.' },

  // ── Row 1: NTFQ — Natal Survival Pipeline ──
  { id: 'combos',    label: 'Combinations\n合',               x: 0,    y: 120, color: '#f59e0b',
    tip: 'Stem combos (天干合), branch six combos (六合), Three Harmony (三合局), Three Meetings (三会局).' },
  { id: 'clashes',   label: 'Clashes\n冲 害 刑',              x: 250,  y: 120, color: '#f43f5e',
    tip: 'Three-pass clashes: A=natal internal, B=transit internal, C=transit→natal directional.' },
  { id: 'pipeline',  label: 'Control · Overcrowding\nCollapse · Transform',  x: 500, y: 120, color: '#f43f5e',
    tip: 'Control Cycle (克), Overcrowding (溢), Structural Collapse (崩), Transformations (化), Structure (格局).' },

  { id: 'ntfq',      label: 'NTFQ\n(Natal Operating System)', x: 250,  y: 240, color: '#8b5cf6',
    tip: 'Natal Total Functional Qi — TFQ after all 11 internal physics stages. How the soul behaves.' },

  // ── Row 2: MTFQ — Monthly Environment ──
  { id: 'dayun',     label: 'Da Yun Qi\n×0.9',               x: 0,    y: 360, color: '#ef4444',
    tip: '10-year luck pillar. Stem+Branch → Seasonality → Polarity. Weighted at 0.9.' },
  { id: 'yearQi',    label: 'Year Qi\n×0.5',                  x: 250,  y: 360, color: '#ef4444',
    tip: 'Year pillar Qi. Stem+Branch → Seasonality → Polarity. Weighted at 0.5.' },
  { id: 'monthQi',   label: 'Month Qi\n×0.3',                 x: 500,  y: 360, color: '#ef4444',
    tip: 'Month pillar Qi. Stem+Branch → Seasonality → Polarity. Weighted at 0.3.' },

  { id: 'mtfq',      label: 'MTFQ\n(Monthly Environment)',    x: 250,  y: 480, color: '#0ea5e9',
    tip: 'Monthly Total Functional Qi = 1.0×NTFQ + 0.9×DaYun + 0.5×Year + 0.3×Month. The world you walk through.' },

  // ── Row 3: IFQ — Ideal Target ──
  { id: 'balanced',  label: 'Balanced Qi\n20/20/20/20/20',    x: 0,    y: 600, color: '#22c55e',
    tip: 'Neutral starting point — each element at 20%. A blank canvas.' },
  { id: 'yongshen',  label: 'Yong Shen Adj\n(personal)',      x: 250,  y: 600, color: '#14b8a6',
    tip: '+6% primary useful, +4% secondary, +2% child of useful, -6% forbidden, -4% threat.' },
  { id: 'seasonal',  label: 'Seasonal Adj\n(旺相休囚死)',       x: 500,  y: 600, color: '#22c55e',
    tip: 'Monthly correction aligned with seasonal strength. +4% prosperous, -4% dead.' },

  { id: 'ifq',       label: 'IFQ\n(Ideal Target)',            x: 250,  y: 720, color: '#2dd4bf',
    tip: 'Ideal Functional Qi = Balanced + YongShen + Seasonal, normalized to MTFQ total. Who you should be this month.' },

  // ── Row 4: BRQ — Bracelet Correction ──
  { id: 'brq',       label: 'BRQ = IFQ − MTFQ\n(Correction Vector)',  x: 250, y: 840, color: '#f97316',
    tip: 'Bracelet Qi — the difference between ideal and actual. Positive = boost, negative = reduce.' },

  { id: 'bracelet',  label: 'Bracelet Design\n(Stones + Beads)',      x: 250, y: 960, color: '#ec4899',
    tip: 'Stone selection, bead ratios, and remedy mode implement the BRQ correction physically.' },
];

const EDGE_DEFS = [
  // TFQ → NTFQ pipeline
  { source: 'tfq',       target: 'combos' },
  { source: 'tfq',       target: 'clashes' },
  { source: 'tfq',       target: 'pipeline' },
  { source: 'combos',    target: 'ntfq' },
  { source: 'clashes',   target: 'ntfq' },
  { source: 'pipeline',  target: 'ntfq' },

  // NTFQ + external layers → MTFQ
  { source: 'ntfq',      target: 'mtfq' },
  { source: 'dayun',     target: 'mtfq' },
  { source: 'yearQi',    target: 'mtfq' },
  { source: 'monthQi',   target: 'mtfq' },

  // IFQ construction
  { source: 'balanced',  target: 'ifq' },
  { source: 'yongshen',  target: 'ifq' },
  { source: 'seasonal',  target: 'ifq' },
  { source: 'mtfq',      target: 'ifq' },   // normalization target

  // BRQ = IFQ - MTFQ
  { source: 'ifq',       target: 'brq' },
  { source: 'mtfq',      target: 'brq' },

  // BRQ → Bracelet
  { source: 'brq',       target: 'bracelet' },
];

// ─── Animated Qi-Particle Edge ──────────────────────────────────────────────

function QiParticleEdge({ id, sourceX, sourceY, targetX, targetY, style }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ ...style, stroke: '#475569', strokeWidth: 1.5 }} />
      {/* Animated Qi particle */}
      <circle r={3.5} fill="#f87171" opacity={0.9}>
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
      </circle>
      <circle r={3.5} fill="#38bdf8" opacity={0.7}>
        <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} begin="1.25s" />
      </circle>
    </>
  );
}

// ─── Education-mode node with tooltip ───────────────────────────────────────

function buildNodes(educationMode) {
  return PIPELINE_STEPS.map(step => ({
    id: step.id,
    position: { x: step.x, y: step.y },
    data: { label: step.label, tip: educationMode ? step.tip : null },
    type: educationMode ? 'tooltipNode' : 'default',
    style: educationMode ? undefined : {
      background: step.color + '20',
      border: `1px solid ${step.color}80`,
      borderRadius: 8,
      padding: '8px 12px',
      color: '#e2e8f0',
      fontSize: 11,
      fontFamily: 'monospace',
      textAlign: 'center',
      whiteSpace: 'pre-line',
      width: 160,
    },
  }));
}

function TooltipNode({ data }) {
  const step = PIPELINE_STEPS.find(s => s.label === data.label);
  const color = step?.color || '#64748b';
  return (
    <div className="group relative">
      <div style={{
        background: color + '20',
        border: `1px solid ${color}80`,
        borderRadius: 8,
        padding: '8px 12px',
        color: '#e2e8f0',
        fontSize: 11,
        fontFamily: 'monospace',
        textAlign: 'center',
        whiteSpace: 'pre-line',
        width: 160,
      }}>
        {data.label}
      </div>
      {data.tip && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="p-2 max-w-[200px] text-[10px] bg-slate-800 text-slate-200 rounded-lg shadow-xl border border-slate-600 leading-tight">
            {data.tip}
          </div>
        </div>
      )}
    </div>
  );
}

function buildEdges(educationMode) {
  return EDGE_DEFS.map((e, i) => ({
    id: `e${i}`,
    source: e.source,
    target: e.target,
    type: educationMode ? 'qiParticle' : 'default',
    animated: !educationMode,
    style: { stroke: '#475569', strokeWidth: 1.5 },
  }));
}

// ─── Main Component ─────────────────────────────────────────────────────────

const edgeTypes = { qiParticle: QiParticleEdge };
const nodeTypes = { tooltipNode: TooltipNode };

export function QiPipelineFlow({ className = '', educationMode = false }) {
  const initialNodes = useMemo(() => buildNodes(educationMode), [educationMode]);
  const initialEdges = useMemo(() => buildEdges(educationMode), [educationMode]);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className={`w-full h-[900px] rounded-xl overflow-hidden border border-slate-700 bg-slate-900 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          nodeColor={n => {
            const step = PIPELINE_STEPS.find(s => s.id === n.id);
            return step?.color || '#64748b';
          }}
          maskColor="#0f172a90"
          style={{ background: '#1e293b' }}
        />
        <Controls />
        <Background gap={20} color="#334155" />
      </ReactFlow>
    </div>
  );
}

export default QiPipelineFlow;
