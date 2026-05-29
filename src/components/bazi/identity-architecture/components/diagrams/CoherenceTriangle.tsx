import React from 'react';

export const CoherenceTriangle: React.FC<{ coherenceIndex: number }> = ({ coherenceIndex }) => {
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
