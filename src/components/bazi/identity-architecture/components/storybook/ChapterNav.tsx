/**
 * ChapterNav — pill navigation bar + prev/next buttons
 */

import React from 'react';

export const CHAPTERS = [
  'Heaven Self',
  'Earth Self',
  'Human Self',
  'Tension Map',
  'Cathedral Map',
  'Destiny Pulse',
  'Contradiction Story',
  'Identity Codex',
] as const;

export type ChapterName = (typeof CHAPTERS)[number];

interface Props {
  currentIdx: number;
  onNavigate: (idx: number) => void;
}

const NavBtn: React.FC<{ label: string; onClick: () => void; disabled: boolean }> = ({
  label, onClick, disabled,
}) => (
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

export const ChapterNav: React.FC<Props> = ({ currentIdx, onNavigate }) => (
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
          onClick={() => onNavigate(i)}
          style={{
            padding: '5px 10px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: i === currentIdx ? 700 : 500,
            background: i === currentIdx ? 'rgba(248,250,252,0.9)' : 'rgba(51,65,85,0.5)',
            color: i === currentIdx ? '#0f172a' : '#94a3b8',
            transition: 'all 0.15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '4px' }}>
      <NavBtn label="‹ Prev" onClick={() => onNavigate(currentIdx - 1)} disabled={currentIdx === 0} />
      <NavBtn label="Next ›" onClick={() => onNavigate(currentIdx + 1)} disabled={currentIdx === CHAPTERS.length - 1} />
    </div>
  </div>
);
