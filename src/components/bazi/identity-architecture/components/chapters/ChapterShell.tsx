/**
 * ChapterShell — shared card wrapper for all storybook chapters
 */

import React from 'react';

interface Props {
  title: string;
  subtitle: string;
  footer: string;
  gradient?: string;
  children: React.ReactNode;
}

export const ChapterShell: React.FC<Props> = ({ title, subtitle, footer, gradient, children }) => (
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

export const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '2px' }}>{label}</div>
    <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{value}</div>
  </div>
);

export const BulletList: React.FC<{ label: string; items: string[] }> = ({ label, items }) => (
  <div>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>{label}</div>
    <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
      {items.map((s, i) => (
        <li key={i} style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{s}</li>
      ))}
    </ul>
  </div>
);
