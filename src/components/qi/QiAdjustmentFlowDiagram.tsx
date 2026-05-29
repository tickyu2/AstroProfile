/**
 * QiAdjustmentFlowDiagram — Interactive React Flow pipeline diagram.
 *
 * Prerequisite: npm install @xyflow/react
 *
 * Usage:
 *   import QiAdjustmentFlowDiagram from '../components/qi/QiAdjustmentFlowDiagram';
 *   <QiAdjustmentFlowDiagram />
 */

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { qiAdjustmentNodes, qiAdjustmentEdges } from '../../data/qiAdjustmentFlow';

// ============================================================================
// Custom node with description tooltip
// ============================================================================

function PipelineNode({ data }: { data: { label: string; description?: string } }) {
  return (
    <div className="group relative">
      <Handle type="target" position={Position.Top} className="!bg-slate-500" />
      <div className="px-3 py-2 text-center min-w-[120px]">
        <div className="text-xs font-bold text-white">{data.label}</div>
        {data.description && (
          <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500" />
    </div>
  );
}

const nodeTypes: NodeTypes = {
  default: PipelineNode,
  input: PipelineNode,
  output: PipelineNode,
};

// ============================================================================
// MiniMap color mapping
// ============================================================================

const MINIMAP_COLORS: Record<string, string> = {
  atfq: '#3b82f6',
  acymfq: '#f59e0b',
  passA: '#ef4444',
  passB: '#ef4444',
  passC: '#dc2626',
  recombine: '#a855f7',
  sheng: '#22c55e',
  damping: '#6b7280',
  transform: '#eab308',
  mffq: '#10b981',
  yongshen: '#8b5cf6',
};

function minimapNodeColor(node: Node): string {
  return MINIMAP_COLORS[node.id] || '#1e293b';
}

// ============================================================================
// Main component
// ============================================================================

export default function QiAdjustmentFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(qiAdjustmentNodes as Node[]);
  const [edges, , onEdgesChange] = useEdgesState(qiAdjustmentEdges as Edge[]);

  return (
    <div className="w-full rounded-xl border border-white/10 overflow-hidden" style={{ height: 750 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
        }}
      >
        <Background
          color="#334155"
          gap={20}
          size={1}
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="!bg-slate-800 !border-slate-600 !shadow-lg [&_button]:!bg-slate-700 [&_button]:!border-slate-600 [&_button]:!text-white [&_button:hover]:!bg-slate-600"
        />
        <MiniMap
          nodeColor={minimapNodeColor}
          nodeStrokeColor="#475569"
          nodeBorderRadius={4}
          maskColor="rgba(0, 0, 0, 0.6)"
          className="!bg-slate-900 !border-slate-700"
          position="top-right"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
