/**
 * Codex sub-components — reusable cards and lists for the Identity Codex layout
 */

import React from 'react';
import type { Element } from '../../engine/identityTypes';
import { ELEMENT_GRADIENTS, ELEMENT_ICONS } from '../../utils/elementTheme';

export const CodexSelfCard: React.FC<{
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

export const CodexTensionList: React.FC<{
  title: string; items: Array<{ text: string }>;
}> = ({ title, items }) => (
  <div>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>{title}</div>
    {items.length === 0 ? (
      <div style={{ fontSize: '10px', color: '#475569', fontStyle: 'italic' }}>None</div>
    ) : (
      items.map((t, i) => (
        <div key={i} style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '3px' }}>
          {'•'} {t.text}
        </div>
      ))
    )}
  </div>
);
