/**
 * qiAdjustmentFlow.js — React Flow node/edge config for the Qi Adjustment Pipeline.
 *
 * Ready to paste into a React Flow <ReactFlow nodes={nodes} edges={edges} /> component.
 * If you don't have React Flow installed, this config also serves as a structured
 * data source for any custom pipeline visualisation component.
 *
 * Install: npm install @xyflow/react   (if you want to use React Flow directly)
 */

export const qiAdjustmentNodes = [
  // --- Input pools ---
  {
    id: 'atfq',
    type: 'input',
    position: { x: 50, y: 0 },
    data: {
      label: 'ATFQ (60%)',
      description: 'Your natal TFQ scaled to 60%. The structural car — permanent elemental architecture.',
    },
    style: { background: '#1e3a5f', border: '2px solid #3b82f6', color: '#fff', borderRadius: 12, padding: 12 },
  },
  {
    id: 'acymfq',
    type: 'input',
    position: { x: 350, y: 0 },
    data: {
      label: 'ACYMFQ (40%)',
      description: 'Current Year + Month FQ scaled to 40%. The weather — environmental modulation.',
    },
    style: { background: '#5f3a1e', border: '2px solid #f59e0b', color: '#fff', borderRadius: 12, padding: 12 },
  },

  // --- Three-Pass Clash ---
  {
    id: 'passA',
    position: { x: 50, y: 120 },
    data: {
      label: 'Pass A: Natal Internal (克)',
      description: 'Your own elements fighting each other. Victim -10% of attacker, attacker -2%.',
    },
    style: { background: '#3f1515', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 8, padding: 10 },
  },
  {
    id: 'passB',
    position: { x: 350, y: 120 },
    data: {
      label: 'Pass B: Transit Internal (克)',
      description: 'Year and Month pillars clashing with each other — weather turbulence.',
    },
    style: { background: '#3f1515', border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 8, padding: 10 },
  },
  {
    id: 'passC',
    position: { x: 130, y: 240 },
    data: {
      label: 'Pass C: Transit → Natal (克)',
      description: 'Environment pressing on you. Transit attacks natal; transit is NOT reduced.',
    },
    style: { background: '#5f0f0f', border: '2px solid #dc2626', color: '#fecaca', borderRadius: 8, padding: 10 },
  },
  {
    id: 'recombine',
    position: { x: 130, y: 350 },
    data: {
      label: 'Recombine',
      description: 'Pass C natal result + Pass B transit result = Post-Clash NTFQ.',
    },
    style: { background: '#2d1b4e', border: '1px solid #a855f7', color: '#d8b4fe', borderRadius: 8, padding: 10 },
  },

  // --- Post-Clash Pipeline ---
  {
    id: 'sheng',
    position: { x: 130, y: 460 },
    data: {
      label: 'Sheng Nourishment (生)',
      description: 'Parent feeds child +3%, capped at 20% of child. Parent NOT drained.',
    },
    style: { background: '#0f3f1a', border: '1px solid #22c55e', color: '#86efac', borderRadius: 8, padding: 10 },
  },
  {
    id: 'damping',
    position: { x: 130, y: 560 },
    data: {
      label: 'Universal Damping (耗)',
      description: 'All elements x 0.98. Baseline friction — the cost of existing.',
    },
    style: { background: '#1f1f1f', border: '1px solid #6b7280', color: '#d1d5db', borderRadius: 8, padding: 10 },
  },
  {
    id: 'transform',
    position: { x: 130, y: 660 },
    data: {
      label: 'Transformation (化)',
      description: 'If attacker >1.5 AND ratio >3:1, 30% of victim transmutes to child element.',
    },
    style: { background: '#3f2f0f', border: '1px solid #eab308', color: '#fde68a', borderRadius: 8, padding: 10 },
  },

  // --- Output ---
  {
    id: 'mtfq',
    type: 'output',
    position: { x: 100, y: 780 },
    data: {
      label: 'TotalQi Output',
      description: 'Month Total Functional Qi — drives Yong Shen + Stone Rx.',
    },
    style: { background: '#0f2f1f', border: '2px solid #10b981', color: '#6ee7b7', borderRadius: 12, padding: 12 },
  },
  {
    id: 'yongshen',
    type: 'output',
    position: { x: 100, y: 890 },
    data: {
      label: 'Yong Shen (用神) + Stone Rx',
      description: 'Weakest element identified → matching stones/crystals prescribed.',
    },
    style: { background: '#1a1a2e', border: '2px solid #8b5cf6', color: '#c4b5fd', borderRadius: 12, padding: 12 },
  },
];

export const qiAdjustmentEdges = [
  // Inputs → Pass A/B
  { id: 'e-atfq-passA',    source: 'atfq',      target: 'passA',     animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e-acymfq-passB',  source: 'acymfq',    target: 'passB',     animated: true, style: { stroke: '#f59e0b' } },

  // Pass A/B → Pass C
  { id: 'e-passA-passC',   source: 'passA',     target: 'passC',     label: 'natal after internal',  style: { stroke: '#ef4444' } },
  { id: 'e-passB-passC',   source: 'passB',     target: 'passC',     label: 'transit attacks natal', style: { stroke: '#ef4444', strokeDasharray: '5 5' } },

  // Pass B → Recombine (transit result passes through)
  { id: 'e-passB-recomb',  source: 'passB',     target: 'recombine', label: 'transit result',        style: { stroke: '#f59e0b', strokeDasharray: '5 5' } },
  // Pass C → Recombine (natal result)
  { id: 'e-passC-recomb',  source: 'passC',     target: 'recombine', label: 'natal result',          style: { stroke: '#3b82f6' } },

  // Pipeline
  { id: 'e-recomb-sheng',  source: 'recombine', target: 'sheng',     style: { stroke: '#a855f7' } },
  { id: 'e-sheng-damp',    source: 'sheng',     target: 'damping',   style: { stroke: '#22c55e' } },
  { id: 'e-damp-trans',    source: 'damping',   target: 'transform', style: { stroke: '#6b7280' } },
  { id: 'e-trans-mtfq',    source: 'transform', target: 'mtfq',      style: { stroke: '#eab308' } },
  { id: 'e-mtfq-yong',     source: 'mtfq',      target: 'yongshen',  style: { stroke: '#10b981' } },
];

/**
 * Flat summary for rendering a simplified pipeline without React Flow.
 * Each entry has: id, label, description, color, icon.
 */
export const qiPipelineSteps = [
  { id: 'atfq',      label: 'ATFQ (60%)',                    description: 'Natal TFQ x 60%',                        color: '#3b82f6', icon: '🔵' },
  { id: 'acymfq',    label: 'ACYMFQ (40%)',                  description: 'Transit CYMFQ x 40%',                     color: '#f59e0b', icon: '🟠' },
  { id: 'passA',     label: 'Pass A: Natal Internal (克)',    description: 'Natal elements clash internally',          color: '#ef4444', icon: '⚔️' },
  { id: 'passB',     label: 'Pass B: Transit Internal (克)',  description: 'Year/Month pillars clash internally',      color: '#ef4444', icon: '⚔️' },
  { id: 'passC',     label: 'Pass C: Transit → Natal (克)',   description: 'Environment presses on natal — one-way',   color: '#dc2626', icon: '🎯' },
  { id: 'recombine', label: 'Recombine',                     description: 'Pass C natal + Pass B transit merged',     color: '#a855f7', icon: '🔄' },
  { id: 'sheng',     label: 'Sheng Nourishment (生)',         description: 'Parent feeds child +3%, cap 20%',          color: '#22c55e', icon: '🌱' },
  { id: 'damping',   label: 'Universal Damping (耗)',         description: 'All elements x 0.98',                      color: '#6b7280', icon: '🌬️' },
  { id: 'transform', label: 'Transformation (化)',            description: '>1.5 AND >3:1 → 30% transmute',           color: '#eab308', icon: '🔮' },
  { id: 'mtfq',      label: 'TotalQi Output',                   description: 'Month Total Functional Qi (MTFQ)',        color: '#10b981', icon: '✅' },
  { id: 'yongshen',  label: 'Yong Shen + Stone Rx',          description: 'Weakest element → crystal prescription',   color: '#8b5cf6', icon: '💎' },
];
