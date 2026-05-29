import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

/**
 * Calculation Popup — "Show Your Work"
 * Shows step-by-step mathematical derivation of:
 *   Tab 1: Seasonal Perfect Baseline (constitutional perfect × multipliers → normalize)
 *   Tab 2: User's Adjusted Values (user raw × multipliers → normalize)
 * Plus a comparison panel showing difference and status.
 */

const CONSTITUTIONAL_PERFECT = { wood: 22, fire: 21, earth: 20, water: 19, metal: 18 };

const SEASONAL_MULTIPLIERS = {
  tiger:   { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6, season: 'Spring' },
  rabbit:  { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6, season: 'Spring' },
  dragon:  { wood: 0.6, fire: 0.8, earth: 1.0, metal: 0.4, water: 0.4, season: 'Spring→Summer' },
  snake:   { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2, season: 'Summer' },
  horse:   { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2, season: 'Summer' },
  goat:    { wood: 0.4, fire: 0.6, earth: 1.0, metal: 0.8, water: 0.4, season: 'Summer→Autumn' },
  monkey:  { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8, season: 'Autumn' },
  rooster: { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8, season: 'Autumn' },
  dog:     { wood: 0.4, fire: 0.4, earth: 1.0, metal: 0.6, water: 0.8, season: 'Autumn→Winter' },
  pig:     { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0, season: 'Winter' },
  rat:     { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0, season: 'Winter' },
  ox:      { wood: 0.8, fire: 0.4, earth: 1.0, metal: 0.4, water: 0.6, season: 'Winter→Spring' }
};

const ELEMENTS = {
  wood:  { name: 'Wood',  emoji: '🌳', color: '#10b981' },
  fire:  { name: 'Fire',  emoji: '🔥', color: '#ef4444' },
  earth: { name: 'Earth', emoji: '⛰️', color: '#f59e0b' },
  water: { name: 'Water', emoji: '💧', color: '#3b82f6' },
  metal: { name: 'Metal', emoji: '⚙️', color: '#9ca3af' }
};

const ANIMAL_NAMES = {
  tiger: 'Tiger 寅', rabbit: 'Rabbit 卯', dragon: 'Dragon 辰', snake: 'Snake 巳',
  horse: 'Horse 午', goat: 'Goat 未', monkey: 'Monkey 申', rooster: 'Rooster 酉',
  dog: 'Dog 戌', pig: 'Pig 亥', rat: 'Rat 子', ox: 'Ox 丑'
};

function getMultiplierPhase(m) {
  if (m >= 1.0) return { label: '旺 Prosperous', color: '#10b981' };
  if (m >= 0.8) return { label: '相 Phase',      color: '#3b82f6' };
  if (m >= 0.6) return { label: '休 Rest',       color: '#f59e0b' };
  if (m >= 0.4) return { label: '囚 Imprisoned', color: '#f97316' };
  return                { label: '死 Death',      color: '#ef4444' };
}

function calcSeasonal(base, multipliers) {
  const adjusted = {};
  let total = 0;
  Object.keys(base).forEach(el => {
    adjusted[el] = base[el] * (multipliers[el] || 1);
    total += adjusted[el];
  });
  const normalized = {};
  Object.keys(adjusted).forEach(el => {
    normalized[el] = total > 0 ? (adjusted[el] / total) * 100 : 20;
  });
  return { adjusted, total, normalized };
}

export default function CalculationPopup({ month, element, userConstitution, onClose, themeMode = 'dark' }) {
  const [activeTab, setActiveTab] = useState('perfect');
  const [pos, setPos] = useState({ x: -1, y: -1 });
  const dragRef = useRef(null);
  const panelRef = useRef(null);
  const isDark = themeMode === 'dark';

  // Center on first render
  useEffect(() => {
    if (pos.x === -1 && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPos({
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 2),
      });
    }
  }, [pos.x]);

  // Drag handlers
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: pos.x, origY: pos.y,
    };
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: dragRef.current.origX + dx,
        y: dragRef.current.origY + dy,
      });
    };
    const onMouseUp = () => { dragRef.current = null; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const monthKey = month.toLowerCase();
  const multipliers = SEASONAL_MULTIPLIERS[monthKey];
  const elConf = ELEMENTS[element];

  if (!multipliers || !elConf) return null;

  const perfectCalc = calcSeasonal(CONSTITUTIONAL_PERFECT, multipliers);
  const userCalc = calcSeasonal(userConstitution, multipliers);

  // Colors
  const bg = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? '#1e293b' : '#f8fafc';
  const borderCol = isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.3)';
  const textPrimary = isDark ? '#e2e8f0' : '#1e293b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const mono = "'JetBrains Mono', monospace";

  const highlightBg = (isTarget, tab) => {
    if (!isTarget) return cardBg;
    return tab === 'perfect'
      ? (isDark ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)')
      : (isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)');
  };
  const highlightBorder = (isTarget, tab) => {
    if (!isTarget) return `1px solid ${borderCol}`;
    return tab === 'perfect'
      ? `2px solid ${isDark ? '#a78bfa' : '#7c3aed'}`
      : `2px solid ${isDark ? '#60a5fa' : '#2563eb'}`;
  };

  // Step component
  const Step = ({ num, title, desc, children }) => (
    <div style={{ position: 'relative', paddingLeft: '44px', marginBottom: '24px' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '32px', height: '32px', borderRadius: '50%',
        background: activeTab === 'perfect' ? '#7c3aed' : '#2563eb',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '14px',
      }}>{num}</div>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontWeight: 700, fontSize: '14px', color: textPrimary }}>{title}</div>
        <div style={{ fontSize: '11px', color: textSecondary }}>{desc}</div>
      </div>
      {children}
    </div>
  );

  // Render the 5-element grid (Step 1)
  const renderBaseGrid = (base, tab) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {Object.entries(base).map(([el, val]) => {
        const isTarget = el === element;
        return (
          <div key={el} style={{
            flex: '1 1 80px', minWidth: '80px', padding: '10px 8px', borderRadius: '10px', textAlign: 'center',
            background: highlightBg(isTarget, tab),
            border: highlightBorder(isTarget, tab),
          }}>
            <div style={{ fontSize: '20px', marginBottom: '2px' }}>{ELEMENTS[el].emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: isTarget ? ELEMENTS[el].color : textPrimary, fontFamily: mono }}>
              {typeof val === 'number' ? val.toFixed(1) : val}%
            </div>
            <div style={{ fontSize: '9px', color: textMuted, textTransform: 'capitalize' }}>{el}</div>
          </div>
        );
      })}
    </div>
  );

  // Render multiplication rows (Step 2)
  const renderMultRows = (base, tab, calc) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {Object.entries(base).map(([el, val]) => {
        const m = multipliers[el];
        const adj = val * m;
        const isTarget = el === element;
        const phase = getMultiplierPhase(m);
        return (
          <div key={el} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px',
            background: highlightBg(isTarget, tab),
            border: highlightBorder(isTarget, tab),
          }}>
            <span style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>{ELEMENTS[el].emoji}</span>
            <span style={{ flex: 1, fontFamily: mono, fontSize: '12px', color: textPrimary }}>
              {val.toFixed(1)}% × {m.toFixed(1)} = <strong>{adj.toFixed(2)}</strong>
            </span>
            <span style={{ fontSize: '10px', color: phase.color, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {phase.label}
            </span>
          </div>
        );
      })}
      {/* Total */}
      <div style={{
        marginTop: '8px', padding: '10px 14px', borderRadius: '8px',
        background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
        border: `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.15)'}`,
      }}>
        <div style={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#93c5fd' : '#1e40af' }}>
          Total Adjusted: {calc.total.toFixed(2)}
        </div>
        <div style={{ fontSize: '10px', color: textSecondary, marginTop: '2px' }}>
          {tab === 'user'
            ? (calc.total > 80 ? 'High total from strong base constitution' : calc.total < 50 ? 'Low total — weak elements further reduced' : 'Within normal adjusted range')
            : 'Not 100% because seasonal changes affect total energy differently'
          }
        </div>
      </div>
    </div>
  );

  // Render normalization rows (Step 3)
  const renderNormRows = (calc, tab) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {Object.entries(calc.adjusted).map(([el, adj]) => {
        const norm = calc.normalized[el];
        const isTarget = el === element;
        return (
          <div key={el} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px',
            background: highlightBg(isTarget, tab),
            border: highlightBorder(isTarget, tab),
          }}>
            <span style={{ fontSize: '18px', width: '28px', textAlign: 'center' }}>{ELEMENTS[el].emoji}</span>
            <span style={{ flex: 1, fontFamily: mono, fontSize: '12px', color: textPrimary }}>
              {adj.toFixed(2)} ÷ {calc.total.toFixed(2)} × 100 = <strong>{norm.toFixed(1)}%</strong>
            </span>
          </div>
        );
      })}
    </div>
  );

  const perfectNorm = perfectCalc.normalized[element];
  const userNorm = userCalc.normalized[element];
  const diff = userNorm - perfectNorm;
  const status = diff > 10 ? 'excess' : diff < -10 ? 'deficient' : 'balanced';
  const statusColor = status === 'excess' ? '#ef4444' : status === 'deficient' ? '#3b82f6' : '#10b981';

  const popup = (
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          left: pos.x === -1 ? '50%' : `${pos.x}px`,
          top: pos.x === -1 ? '50%' : `${pos.y}px`,
          transform: pos.x === -1 ? 'translate(-50%, -50%)' : 'none',
          zIndex: 10000,
          background: bg, borderRadius: '16px', width: '720px', maxWidth: '95vw',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          border: `1px solid ${borderCol}`,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Draggable Header */}
        <div
          onMouseDown={onMouseDown}
          style={{
            padding: '16px 20px', borderRadius: '16px 16px 0 0',
            cursor: 'grab',
            userSelect: 'none',
            background: activeTab === 'perfect'
              ? (isDark ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(88,28,135,0.15))' : 'linear-gradient(135deg, #ede9fe, #ddd6fe)')
              : (isDark ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.15))' : 'linear-gradient(135deg, #dbeafe, #bfdbfe)'),
            borderBottom: `1px solid ${borderCol}`,
          }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🔢</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: textPrimary }}>
                  Seasonal Calculation Breakdown
                </div>
                <div style={{ fontSize: '12px', color: textSecondary }}>
                  {elConf.emoji} {elConf.name} — {ANIMAL_NAMES[monthKey] || monthKey} ({multipliers.season})
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              onMouseDown={e => e.stopPropagation()}
              style={{
                width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                background: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.05)',
                border: `1px solid ${borderCol}`,
                color: textSecondary, fontSize: '16px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${borderCol}` }}>
          {[
            { key: 'perfect', label: '📐 Perfect Baseline', accent: '#7c3aed' },
            { key: 'user',    label: '👤 Your Values',      accent: '#2563eb' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '12px 16px', cursor: 'pointer',
                fontWeight: activeTab === tab.key ? 700 : 500,
                fontSize: '13px',
                color: activeTab === tab.key ? tab.accent : textSecondary,
                background: activeTab === tab.key ? bg : (isDark ? 'rgba(30,41,59,0.5)' : '#f1f5f9'),
                borderBottom: activeTab === tab.key ? `3px solid ${tab.accent}` : '3px solid transparent',
                border: 'none', borderTop: 'none',
                transition: 'all 0.2s',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'perfect' ? (
            <>
              {/* Info box */}
              <div style={{
                padding: '12px 14px', borderRadius: '10px', marginBottom: '20px',
                background: isDark ? 'rgba(139,92,246,0.08)' : '#faf5ff',
                border: `1px solid ${isDark ? 'rgba(139,92,246,0.25)' : '#e9d5ff'}`,
                borderLeft: `4px solid #7c3aed`,
              }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: isDark ? '#c4b5fd' : '#6d28d9', marginBottom: '4px' }}>
                  ℹ️ What is "Perfect" Seasonal Baseline?
                </div>
                <div style={{ fontSize: '11px', color: textSecondary, lineHeight: 1.5 }}>
                  Starting from the constitutional perfect (22-21-20-19-18), we apply seasonal
                  multipliers based on traditional BaZi theory, then normalize to 100%.
                  This shows what's naturally healthy for this time of year.
                </div>
              </div>

              <Step num={1} title="Constitutional Perfect Baseline" desc="Year-round average (before seasonal adjustment)">
                {renderBaseGrid(CONSTITUTIONAL_PERFECT, 'perfect')}
              </Step>

              <Step num={2} title="Apply Seasonal Multipliers" desc={`${multipliers.season} season adjustments`}>
                {renderMultRows(CONSTITUTIONAL_PERFECT, 'perfect', perfectCalc)}
              </Step>

              <Step num={3} title="Normalize to 100%" desc="Divide each by total, multiply by 100">
                {renderNormRows(perfectCalc, 'perfect')}
              </Step>

              {/* Final result */}
              <div style={{
                padding: '20px', borderRadius: '12px', textAlign: 'center',
                background: isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5',
                border: `2px solid ${isDark ? 'rgba(16,185,129,0.3)' : '#6ee7b7'}`,
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
                  ✓ Perfect {elConf.name} for {multipliers.season}
                </div>
                <div style={{ fontSize: '36px', fontWeight: 800, color: elConf.color, fontFamily: mono }}>
                  {perfectNorm.toFixed(1)}%
                </div>
                <div style={{ fontSize: '11px', color: textSecondary, marginTop: '4px' }}>
                  This is what's naturally healthy for this season
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Info box */}
              <div style={{
                padding: '12px 14px', borderRadius: '10px', marginBottom: '20px',
                background: isDark ? 'rgba(59,130,246,0.08)' : '#eff6ff',
                border: `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : '#bfdbfe'}`,
                borderLeft: `4px solid #2563eb`,
              }}>
                <div style={{ fontWeight: 700, fontSize: '12px', color: isDark ? '#93c5fd' : '#1d4ed8', marginBottom: '4px' }}>
                  ℹ️ Your Seasonally-Adjusted Values
                </div>
                <div style={{ fontSize: '11px', color: textSecondary, lineHeight: 1.5 }}>
                  Starting from YOUR constitutional makeup, we apply the same seasonal multipliers,
                  then normalize. This shows how your actual values compare to what's healthy for this season.
                </div>
              </div>

              <Step num={1} title="Your Raw Constitution" desc="Your innate elemental distribution (unadjusted)">
                {renderBaseGrid(userConstitution, 'user')}
              </Step>

              <Step num={2} title="Apply Seasonal Multipliers" desc={`Same ${multipliers.season} multipliers as perfect baseline`}>
                {renderMultRows(userConstitution, 'user', userCalc)}
              </Step>

              <Step num={3} title="Normalize to 100%" desc="Divide each by total, multiply by 100">
                {renderNormRows(userCalc, 'user')}
              </Step>

              {/* Comparison panel */}
              <div style={{
                padding: '20px', borderRadius: '12px', textAlign: 'center',
                background: isDark
                  ? `${statusColor}10`
                  : status === 'excess' ? '#fef2f2' : status === 'deficient' ? '#eff6ff' : '#ecfdf5',
                border: `2px solid ${statusColor}${isDark ? '50' : '80'}`,
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginBottom: '12px' }}>
                  {elConf.emoji} {elConf.name} Comparison
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: textMuted, marginBottom: '2px' }}>Perfect for Season</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: '#7c3aed', fontFamily: mono }}>
                      {perfectNorm.toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '20px', color: textMuted }}>→</div>
                  <div>
                    <div style={{ fontSize: '10px', color: textMuted, marginBottom: '2px' }}>Your Adjusted Value</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: elConf.color, fontFamily: mono }}>
                      {userNorm.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: statusColor }}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                  {status === 'excess' && ' ⚠️ EXCESS'}
                  {status === 'deficient' && ' ⚠️ DEFICIENT'}
                  {status === 'balanced' && ' ✓ BALANCED'}
                </div>
                <div style={{ fontSize: '11px', color: textSecondary, marginTop: '6px' }}>
                  {status === 'excess' && `Even in ${multipliers.season}, your ${elConf.name} is ${Math.abs(diff).toFixed(1)}% above healthy range`}
                  {status === 'deficient' && `In ${multipliers.season}, your ${elConf.name} is ${Math.abs(diff).toFixed(1)}% below healthy range`}
                  {status === 'balanced' && `Your ${elConf.name} is well-balanced for ${multipliers.season}!`}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  );

  return ReactDOM.createPortal(popup, document.body);
}
