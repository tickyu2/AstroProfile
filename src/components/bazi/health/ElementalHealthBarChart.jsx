import React, { useState, useMemo } from 'react';
import CalculationPopup from './CalculationPopup';
import MonthlyElementChart from './MonthlyElementChart';

/**
 * Interactive Five Elements Health Bar Chart
 * Shows perfect baseline (22-21-20-19-18), health zones, user's actual values,
 * and expandable 12-month seasonal variations.
 *
 * Supports 13 views: Overall (birth-month adjusted) + 12 individual monthly views.
 * Each monthly view recalculates elements using that month's seasonal multipliers.
 *
 * Based on: PERFECT_HUMAN_ELEMENTAL_BALANCE_ANALYSIS.md
 * Perfect human baseline: Wood 22%, Fire 21%, Earth 20%, Water 19%, Metal 18%
 */

const ELEMENTS = {
  wood:  { name: 'Wood',  emoji: '🌳', color: '#10b981', perfect: 22, organs: 'Liver & Gallbladder',         chineseName: '肝胆' },
  fire:  { name: 'Fire',  emoji: '🔥', color: '#ef4444', perfect: 21, organs: 'Heart & Small Intestine',     chineseName: '心小肠' },
  earth: { name: 'Earth', emoji: '⛰️', color: '#f59e0b', perfect: 20, organs: 'Spleen & Stomach',            chineseName: '脾胃' },
  water: { name: 'Water', emoji: '💧', color: '#3b82f6', perfect: 19, organs: 'Kidneys & Bladder',           chineseName: '肾膀胱' },
  metal: { name: 'Metal', emoji: '⚙️', color: '#9ca3af', perfect: 18, organs: 'Lungs & Large Intestine',     chineseName: '肺大肠' }
};

const ZONES = {
  deficiency: { max: 10 },
  balancedMin: 15,
  balancedMax: 25,
  excess: { min: 30 }
};

// Seasonal multipliers from the seasonal weighting table
const SEASONAL_MULTIPLIERS = {
  spring_tiger_rabbit:    { wood: 1.0, fire: 0.8, earth: 0.4, metal: 0.2, water: 0.6 },
  summer_snake_horse:     { wood: 0.6, fire: 1.0, earth: 0.8, metal: 0.4, water: 0.2 },
  autumn_monkey_rooster:  { wood: 0.2, fire: 0.4, earth: 0.6, metal: 1.0, water: 0.8 },
  winter_pig_rat:         { wood: 0.8, fire: 0.2, earth: 0.4, metal: 0.6, water: 1.0 },
  spring_dragon:          { wood: 0.6, fire: 0.8, earth: 1.0, metal: 0.4, water: 0.4 },
  summer_goat:            { wood: 0.4, fire: 0.6, earth: 1.0, metal: 0.8, water: 0.4 },
  autumn_dog:             { wood: 0.4, fire: 0.4, earth: 1.0, metal: 0.6, water: 0.8 },
  winter_ox:              { wood: 0.8, fire: 0.4, earth: 1.0, metal: 0.4, water: 0.6 }
};

const TWELVE_MONTHS = [
  { name: 'Tiger 寅',   animal: 'tiger',   season: 'Spring',          key: 'spring_tiger_rabbit',   term: '立春 Spring Begins' },
  { name: 'Rabbit 卯',  animal: 'rabbit',  season: 'Spring',          key: 'spring_tiger_rabbit',   term: '驚蟄 Insects Awaken' },
  { name: 'Dragon 辰',  animal: 'dragon',  season: 'Spring→Summer',   key: 'spring_dragon',         term: '清明 Clear & Bright' },
  { name: 'Snake 巳',   animal: 'snake',   season: 'Summer',          key: 'summer_snake_horse',    term: '立夏 Summer Begins' },
  { name: 'Horse 午',   animal: 'horse',   season: 'Summer',          key: 'summer_snake_horse',    term: '芒種 Grain in Ear' },
  { name: 'Goat 未',    animal: 'goat',    season: 'Summer→Autumn',   key: 'summer_goat',           term: '小暑 Slight Heat' },
  { name: 'Monkey 申',  animal: 'monkey',  season: 'Autumn',          key: 'autumn_monkey_rooster', term: '立秋 Autumn Begins' },
  { name: 'Rooster 酉', animal: 'rooster', season: 'Autumn',          key: 'autumn_monkey_rooster', term: '白露 White Dew' },
  { name: 'Dog 戌',     animal: 'dog',     season: 'Autumn→Winter',   key: 'autumn_dog',            term: '寒露 Cold Dew' },
  { name: 'Pig 亥',     animal: 'pig',     season: 'Winter',          key: 'winter_pig_rat',        term: '立冬 Winter Begins' },
  { name: 'Rat 子',     animal: 'rat',     season: 'Winter',          key: 'winter_pig_rat',        term: '大雪 Heavy Snow' },
  { name: 'Ox 丑',      animal: 'ox',      season: 'Winter→Spring',   key: 'winter_ox',             term: '小寒 Slight Cold' }
];

// Pre-computed normalized seasonal perfect compositions
// Source: TWELVE_MONTH_SEASONAL_PERFECT_COMPOSITION.md
// Method: (Constitutional × Seasonal Multiplier) normalized to 100%
const TWELVE_MONTH_PERFECT = {
  tiger:   { wood: 35.6, fire: 27.2, earth: 12.9, metal: 5.8,  water: 18.4 },
  rabbit:  { wood: 35.6, fire: 27.2, earth: 12.9, metal: 5.8,  water: 18.4 },
  dragon:  { wood: 20.4, fire: 25.9, earth: 30.9, metal: 11.1, water: 11.7 },
  snake:   { wood: 21.6, fire: 34.3, earth: 26.1, metal: 11.8, water: 6.2  },
  horse:   { wood: 21.6, fire: 34.3, earth: 26.1, metal: 11.8, water: 6.2  },
  goat:    { wood: 13.9, fire: 19.9, earth: 31.5, metal: 22.7, water: 12.0 },
  monkey:  { wood: 7.6,  fire: 14.5, earth: 20.7, metal: 31.0, water: 26.2 },
  rooster: { wood: 7.6,  fire: 14.5, earth: 20.7, metal: 31.0, water: 26.2 },
  dog:     { wood: 13.9, fire: 13.3, earth: 31.6, metal: 17.1, water: 24.1 },
  pig:     { wood: 29.5, fire: 7.0,  earth: 13.4, metal: 18.1, water: 31.9 },
  rat:     { wood: 29.5, fire: 7.0,  earth: 13.4, metal: 18.1, water: 31.9 },
  ox:      { wood: 27.2, fire: 13.0, earth: 31.0, metal: 11.1, water: 17.6 }
};

// Animal emojis for tab display
const ANIMAL_EMOJIS = {
  tiger: '🐯', rabbit: '🐰', dragon: '🐲', snake: '🐍', horse: '🐴', goat: '🐐',
  monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐷', rat: '🐀', ox: '🐂'
};

// Branch char to animal mapping
const BRANCH_TO_ANIMAL = {
  '寅': 'tiger', '卯': 'rabbit', '辰': 'dragon', '巳': 'snake', '午': 'horse', '未': 'goat',
  '申': 'monkey', '酉': 'rooster', '戌': 'dog', '亥': 'pig', '子': 'rat', '丑': 'ox'
};

// Season colors for tab indicators
const SEASON_TAB_COLORS = {
  'Spring': '#10b981', 'Spring→Summer': '#a3e635',
  'Summer': '#ef4444', 'Summer→Autumn': '#f97316',
  'Autumn': '#9ca3af', 'Autumn→Winter': '#a78bfa',
  'Winter': '#3b82f6', 'Winter→Spring': '#06b6d4'
};

/**
 * Compute monthly-adjusted element distribution from raw values.
 * Applies the given month's seasonal multipliers and normalizes to 100%.
 */
function computeMonthlyElements(rawElements, monthAnimal) {
  const month = TWELVE_MONTHS.find(m => m.animal === monthAnimal);
  if (!month) return { elements: { ...rawElements }, multipliers: {} };

  const multipliers = SEASONAL_MULTIPLIERS[month.key];
  const weighted = {};
  let total = 0;

  Object.keys(ELEMENTS).forEach(el => {
    weighted[el] = (rawElements[el] || 20) * (multipliers[el] || 1);
    total += weighted[el];
  });

  const normalized = {};
  Object.keys(weighted).forEach(el => {
    normalized[el] = total > 0 ? (weighted[el] / total) * 100 : 20;
  });

  return { elements: normalized, multipliers };
}

function getZoneLabel(value) {
  if (value < ZONES.deficiency.max) return { label: 'Deficient', icon: '⚠' };
  if (value < ZONES.balancedMin)    return { label: 'Moderate',  icon: '~' };
  if (value <= ZONES.balancedMax)   return { label: 'Balanced',  icon: '✓' };
  if (value < ZONES.excess.min)     return { label: 'Moderate',  icon: '~' };
  return { label: 'Excess', icon: '⚠' };
}

function getZoneBadgeStyle(value, isDark) {
  if (value < ZONES.deficiency.max) {
    return { background: isDark ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe', color: isDark ? '#93c5fd' : '#1e40af', border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.4)' : '#93c5fd'}` };
  }
  if (value >= ZONES.balancedMin && value <= ZONES.balancedMax) {
    return { background: isDark ? 'rgba(16, 185, 129, 0.2)' : '#d1fae5', color: isDark ? '#6ee7b7' : '#065f46', border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.4)' : '#6ee7b7'}` };
  }
  if (value >= ZONES.excess.min) {
    return { background: isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2', color: isDark ? '#fca5a5' : '#991b1b', border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.4)' : '#fca5a5'}` };
  }
  return { background: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7', color: isDark ? '#fcd34d' : '#92400e', border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.3)' : '#fcd34d'}` };
}

// Zone background colors for the bar
function getZoneBarColors(isDark) {
  return {
    deficient:    isDark ? 'rgba(59, 130, 246, 0.15)'  : '#dbeafe',
    moderateLow:  isDark ? 'rgba(245, 158, 11, 0.10)'  : '#fef9c3',
    balanced:     isDark ? 'rgba(16, 185, 129, 0.15)'   : '#d1fae5',
    moderateHigh: isDark ? 'rgba(245, 158, 11, 0.10)'  : '#fef9c3',
    excess:       isDark ? 'rgba(239, 68, 68, 0.12)'   : '#fee2e2'
  };
}

function ElementBar({ element, userValue, overallValue, expanded, onToggle, onCalcClick, onChartClick, themeMode, userMonthBranch, weight, perfectOverride }) {
  const config = ELEMENTS[element];
  const perfect = perfectOverride ?? config.perfect;
  const isDark = themeMode === 'dark';
  const zone = getZoneLabel(userValue);
  const badgeStyle = getZoneBadgeStyle(userValue, isDark);
  const zoneColors = getZoneBarColors(isDark);

  // Clamp display to max 60% for the bar scale (most values are 0-60ish)
  const barScale = 60;
  const userBarWidth = Math.min(userValue / barScale * 100, 100);
  const perfectPos = Math.min(perfect / barScale * 100, 100);
  const defEnd = ZONES.deficiency.max / barScale * 100;
  const balStart = ZONES.balancedMin / barScale * 100;
  const balEnd = ZONES.balancedMax / barScale * 100;
  const excStart = ZONES.excess.min / barScale * 100;

  // Find which month the user is born in (for highlighting)
  const branchToMonth = { '寅': 0, '卯': 1, '辰': 2, '巳': 3, '午': 4, '未': 5, '申': 6, '酉': 7, '戌': 8, '亥': 9, '子': 10, '丑': 11 };
  const userMonthIdx = userMonthBranch ? branchToMonth[userMonthBranch] : -1;

  // Weight badge color logic
  const getWeightBadgeStyle = (w) => {
    if (w >= 0.8) return {
      background: `${config.color}20`, border: `1px solid ${config.color}40`, color: config.color
    };
    if (w >= 0.4) return {
      background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24'
    };
    return {
      background: isDark ? 'rgba(100, 116, 139, 0.12)' : 'rgba(100, 116, 139, 0.08)',
      border: `1px solid ${isDark ? 'rgba(100, 116, 139, 0.25)' : 'rgba(100, 116, 139, 0.2)'}`,
      color: isDark ? '#64748b' : '#94a3b8'
    };
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>{config.emoji}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: config.color, lineHeight: 1.2 }}>
                {config.name}
              </span>
              {weight != null && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  padding: '2px 7px', borderRadius: '6px',
                  ...getWeightBadgeStyle(weight),
                }}>
                  ×{weight.toFixed(1)}
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#64748b' : '#94a3b8', lineHeight: 1.2 }}>
              {config.organs} ({config.chineseName})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: isDark ? '#64748b' : '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Value</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: config.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>
              {userValue.toFixed(1)}%
            </div>
            <span style={{
              ...badgeStyle,
              fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px',
              display: 'inline-block', lineHeight: '16px'
            }}>
              {zone.icon} {zone.label}
            </span>
          </div>

          {/* Calculator button — show step-by-step math */}
          <button
            onClick={onCalcClick}
            style={{
              padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
              background: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
              border: `1px solid ${isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)'}`,
              color: isDark ? '#fbbf24' : '#b45309',
              fontSize: '12px', fontWeight: 700,
              transition: 'all 0.2s'
            }}
            title="Show calculation breakdown"
          >
            🔢
          </button>

          {/* Chart button — 12-month seasonal line chart */}
          <button
            onClick={onChartClick}
            style={{
              padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
              background: isDark ? `${config.color}12` : `${config.color}08`,
              border: `1px solid ${isDark ? `${config.color}30` : `${config.color}20`}`,
              color: isDark ? config.color : config.color,
              fontSize: '12px', fontWeight: 700,
              transition: 'all 0.2s'
            }}
            title="12-month seasonal chart"
          >
            📊
          </button>

          <button
            onClick={onToggle}
            style={{
              padding: '6px 10px', borderRadius: '8px', cursor: 'pointer',
              background: expanded
                ? (isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
                : (isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.08)'),
              border: `1px solid ${expanded
                ? (isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)')
                : (isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.15)')}`,
              color: expanded ? '#a78bfa' : (isDark ? '#94a3b8' : '#64748b'),
              fontSize: '13px', fontWeight: 700,
              transition: 'all 0.2s'
            }}
            title="Show 12-month seasonal variations"
          >
            {expanded ? '▾' : '▸'}
          </button>
        </div>
      </div>

      {/* Row 1: Zone reference bar (DEF / BALANCED / EXCESS + perfect marker) */}
      <div style={{
        position: 'relative', height: '28px', borderRadius: '6px 6px 0 0', overflow: 'visible',
        background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f1f5f9',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
        borderBottom: 'none'
      }}>
        {/* Zone bands */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
          <div style={{ width: `${defEnd}%`, background: zoneColors.deficient }} />
          <div style={{ width: `${balStart - defEnd}%`, background: zoneColors.moderateLow }} />
          <div style={{ width: `${balEnd - balStart}%`, background: zoneColors.balanced }} />
          <div style={{ width: `${excStart - balEnd}%`, background: zoneColors.moderateHigh }} />
          <div style={{ width: `${100 - excStart}%`, background: zoneColors.excess }} />
        </div>

        {/* Zone labels — all 5 zones labeled */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 1 }}>
          <span style={{ position: 'absolute', left: `${defEnd / 2}%`, transform: 'translateX(-50%)', fontSize: '8px', fontWeight: 600, color: isDark ? 'rgba(147, 197, 253, 0.7)' : '#3b82f6', letterSpacing: '0.03em' }}>DEF</span>
          <span style={{ position: 'absolute', left: `${(defEnd + balStart) / 2}%`, transform: 'translateX(-50%)', fontSize: '7px', fontWeight: 600, color: isDark ? 'rgba(251, 191, 36, 0.6)' : '#b45309', letterSpacing: '0.03em' }}>LOW</span>
          <span style={{ position: 'absolute', left: `${(balStart + balEnd) / 2}%`, transform: 'translateX(-50%)', fontSize: '8px', fontWeight: 600, color: isDark ? 'rgba(110, 231, 183, 0.7)' : '#059669', letterSpacing: '0.03em' }}>BALANCED</span>
          <span style={{ position: 'absolute', left: `${(balEnd + excStart) / 2}%`, transform: 'translateX(-50%)', fontSize: '7px', fontWeight: 600, color: isDark ? 'rgba(251, 191, 36, 0.6)' : '#b45309', letterSpacing: '0.03em' }}>HIGH</span>
          <span style={{ position: 'absolute', left: `${(excStart + 100) / 2}%`, transform: 'translateX(-50%)', fontSize: '8px', fontWeight: 600, color: isDark ? 'rgba(252, 165, 165, 0.7)' : '#dc2626', letterSpacing: '0.03em' }}>EXCESS</span>
        </div>

        {/* Perfect baseline marker (spans both rows) */}
        <div style={{
          position: 'absolute', top: 0, bottom: '-26px', width: '2px', zIndex: 10,
          left: `${perfectPos}%`,
          background: isDark ? '#e2e8f0' : '#1e293b'
        }}>
          <div style={{
            position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
            whiteSpace: 'nowrap', fontSize: '9px', fontWeight: 700,
            background: isDark ? '#334155' : '#1e293b', color: isDark ? '#e2e8f0' : '#fff',
            padding: '2px 6px', borderRadius: '4px'
          }}>
            ⬥ {perfect.toFixed ? perfect.toFixed(1) : perfect}%
          </div>
        </div>
      </div>

      {/* Row 2: User's value bar (below the zone bar) */}
      <div style={{
        position: 'relative', height: '24px', borderRadius: '0 0 6px 6px', overflow: 'visible',
        background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#e2e8f0',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
        borderTop: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.15)'}`
      }}>
        {/* User value fill */}
        <div style={{
          position: 'absolute', top: '3px', bottom: '3px', left: '3px', zIndex: 3,
          width: `calc(${userBarWidth}% - 6px)`,
          background: `linear-gradient(90deg, ${config.color}66, ${config.color}cc)`,
          borderRadius: '4px',
          transition: 'width 0.5s ease'
        }} />

        {/* User value edge marker */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '3px', zIndex: 6,
          left: `${userBarWidth}%`,
          background: config.color,
          boxShadow: `0 0 8px ${config.color}aa`
        }}>
          <div style={{
            position: 'absolute', bottom: '-18px', left: '50%', transform: 'translateX(-50%)',
            whiteSpace: 'nowrap', fontSize: '9px', fontWeight: 700,
            background: config.color, color: '#fff',
            padding: '2px 6px', borderRadius: '4px'
          }}>
            {userValue.toFixed(1)}%
          </div>
        </div>

        {/* "You" label on the left */}
        <div style={{
          position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
          fontSize: '9px', fontWeight: 700, color: isDark ? 'rgba(226, 232, 240, 0.5)' : 'rgba(30, 41, 59, 0.4)',
          letterSpacing: '0.05em', zIndex: 1, pointerEvents: 'none'
        }}>
          YOU
        </div>
      </div>

      {/* Expanded: 12-month seasonal variations */}
      {expanded && (
        <div style={{
          marginTop: '16px', padding: '16px', borderRadius: '10px',
          background: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(248, 250, 252, 0.9)',
          border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📅 Seasonal Variations — 12 Earthly Branches
            </div>
            <div style={{ fontSize: '10px', color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '2px', background: isDark ? '#e2e8f0' : '#1e293b', borderTop: `1px dashed ${isDark ? '#e2e8f0' : '#1e293b'}` }} />
              = seasonal optimal
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {TWELVE_MONTHS.map((month, idx) => {
              const multiplier = SEASONAL_MULTIPLIERS[month.key][element];
              // Always use overall (birth-month) value for 12-month comparison, not monthly-view value
              const baseValue = overallValue ?? userValue;
              const adjustedValue = baseValue * multiplier;
              const adjBarWidth = Math.min(adjustedValue / barScale * 100, 100);
              // Use pre-computed normalized seasonal perfect (more accurate than perfect × multiplier)
              const seasonalPerfect = TWELVE_MONTH_PERFECT[month.animal]?.[element] ?? (perfect * multiplier);
              const adjPerfectPos = Math.min(seasonalPerfect / barScale * 100, 100);
              const isUserMonth = idx === userMonthIdx;
              const adjZone = getZoneLabel(adjustedValue);

              return (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '4px 6px', borderRadius: '6px',
                  background: isUserMonth ? (isDark ? 'rgba(250, 204, 21, 0.08)' : 'rgba(250, 204, 21, 0.1)') : 'transparent',
                  border: isUserMonth ? `1px solid ${isDark ? 'rgba(250, 204, 21, 0.25)' : 'rgba(250, 204, 21, 0.4)'}` : '1px solid transparent'
                }}>
                  {/* Month name */}
                  <div style={{
                    width: '90px', fontSize: '11px', fontWeight: isUserMonth ? 700 : 500,
                    color: isUserMonth ? '#facc15' : (isDark ? '#cbd5e1' : '#475569'),
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                    {month.name} {isUserMonth && '★'}
                  </div>

                  {/* Mini bar */}
                  <div style={{
                    flex: 1, height: '16px', borderRadius: '4px', position: 'relative', overflow: 'hidden',
                    background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#e2e8f0'
                  }}>
                    <div style={{
                      position: 'absolute', top: '2px', bottom: '2px', left: '2px',
                      width: `calc(${adjBarWidth}% - 4px)`,
                      background: `${config.color}${isUserMonth ? 'cc' : '88'}`,
                      borderRadius: '3px', transition: 'width 0.3s'
                    }} />
                    {/* Seasonal perfect marker — dashed white line */}
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0, width: '2px', zIndex: 2,
                      left: `${adjPerfectPos}%`,
                      background: isDark ? 'rgba(226, 232, 240, 0.7)' : 'rgba(30, 41, 59, 0.6)',
                      borderLeft: `1px dashed ${isDark ? '#e2e8f0' : '#1e293b'}`
                    }} />
                  </div>

                  {/* Adjusted value */}
                  <div style={{
                    width: '50px', textAlign: 'right', fontSize: '11px', fontWeight: 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isDark ? '#cbd5e1' : '#334155'
                  }}>
                    {adjustedValue.toFixed(1)}%
                  </div>

                  {/* Multiplier */}
                  <div style={{
                    width: '36px', textAlign: 'right', fontSize: '10px',
                    color: isDark ? '#64748b' : '#94a3b8',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    ×{multiplier.toFixed(1)}
                  </div>

                  {/* Zone badge */}
                  <div style={{
                    width: '16px', textAlign: 'center', fontSize: '10px',
                    color: adjZone.label === 'Balanced' ? '#10b981'
                         : adjZone.label === 'Deficient' ? '#3b82f6'
                         : adjZone.label === 'Excess' ? '#ef4444'
                         : (isDark ? '#64748b' : '#94a3b8')
                  }}>
                    {adjZone.icon}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Season note */}
          <div style={{
            marginTop: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '10px',
            background: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.05)',
            border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
            color: isDark ? '#93c5fd' : '#1e40af',
            lineHeight: 1.5
          }}>
            <strong>Note:</strong> These values show how seasonal Qi flow modifies your overall {config.name} element strength ({(overallValue ?? userValue).toFixed(1)}%) across the 12 earthly branches.
            At ×1.0, {config.name} is at peak seasonal strength.
            {userMonthIdx >= 0 && ` ★ marks your birth month.`}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ElementalHealthBarChart({ userElements, rawElements, themeMode = 'dark', monthBranch }) {
  const [expandedElements, setExpandedElements] = useState({});
  const [activeView, setActiveView] = useState('overall');
  const [calcPopup, setCalcPopup] = useState(null); // { element: 'wood' } or null
  const [chartPopup, setChartPopup] = useState(null); // { element: 'wood' } or null
  const isDark = themeMode === 'dark';

  const birthMonthAnimal = monthBranch ? BRANCH_TO_ANIMAL[monthBranch] : null;

  const toggleExpand = (element) => {
    setExpandedElements(prev => ({ ...prev, [element]: !prev[element] }));
  };

  // Compute display values based on active view
  const { displayElements, displayMultipliers, viewMonth, monthPerfects } = useMemo(() => {
    if (activeView === 'overall') {
      return { displayElements: userElements, displayMultipliers: null, viewMonth: null, monthPerfects: null };
    }

    const raw = rawElements || userElements;
    const { elements, multipliers } = computeMonthlyElements(raw, activeView);
    const month = TWELVE_MONTHS.find(m => m.animal === activeView);
    const perfects = TWELVE_MONTH_PERFECT[activeView] || null;

    return { displayElements: elements, displayMultipliers: multipliers, viewMonth: month, monthPerfects: perfects };
  }, [activeView, userElements, rawElements]);

  return (
    <div style={{
      padding: '24px', borderRadius: '16px',
      background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.85)',
      border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`
    }}>
      {/* ============================================================ */}
      {/* VIEW SELECTOR TABS: Overall + 12 Monthly Views              */}
      {/* ============================================================ */}
      <div style={{
        marginBottom: '16px',
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'thin',
      }}>
        {/* Overall tab */}
        <button
          onClick={() => setActiveView('overall')}
          style={{
            padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap',
            fontSize: '12px', fontWeight: activeView === 'overall' ? 700 : 500,
            background: activeView === 'overall'
              ? (isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)')
              : (isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)'),
            border: `1px solid ${activeView === 'overall'
              ? (isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)')
              : (isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)')}`,
            color: activeView === 'overall'
              ? '#a78bfa'
              : (isDark ? '#94a3b8' : '#64748b'),
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
        >
          Overall{birthMonthAnimal ? ' ★' : ''}
        </button>

        {/* Month tabs grouped by season */}
        {TWELVE_MONTHS.map((month, idx) => {
          const isActive = activeView === month.animal;
          const isUserMonth = month.animal === birthMonthAnimal;
          const seasonColor = SEASON_TAB_COLORS[month.season] || '#94a3b8';

          // Show season separator before first month of a new season
          const prevSeason = idx > 0 ? TWELVE_MONTHS[idx - 1].season : null;
          const showSeparator = idx === 0 || month.season !== prevSeason;

          return (
            <React.Fragment key={month.animal}>
              {showSeparator && (
                <div style={{
                  display: 'flex', alignItems: 'center', padding: '0 4px', flexShrink: 0,
                  color: seasonColor, fontSize: '9px', fontWeight: 600, opacity: 0.7,
                }}>
                  {idx > 0 && <div style={{ width: '1px', height: '20px', background: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)', marginRight: '6px' }} />}
                  <span>{month.season.split('→')[0].substring(0, 3)}</span>
                </div>
              )}
              <button
                onClick={() => setActiveView(month.animal)}
                style={{
                  padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: '11px', fontWeight: isActive ? 700 : 500,
                  background: isActive
                    ? `${seasonColor}18`
                    : (isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)'),
                  border: `1px solid ${isActive
                    ? `${seasonColor}50`
                    : isUserMonth
                      ? 'rgba(250, 204, 21, 0.3)'
                      : (isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.2)')}`,
                  color: isActive
                    ? seasonColor
                    : isUserMonth
                      ? '#facc15'
                      : (isDark ? '#94a3b8' : '#64748b'),
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                title={`${month.name} — ${month.season} | ${month.term}`}
              >
                {ANIMAL_EMOJIS[month.animal]} {month.name}{isUserMonth && !isActive ? ' ★' : ''}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* MONTHLY VIEW HEADER — seasonal weights summary              */}
      {/* ============================================================ */}
      {viewMonth && displayMultipliers && (
        <div style={{
          marginBottom: '16px', padding: '12px 16px', borderRadius: '10px',
          background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
          border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(148, 163, 184, 0.25)'}`,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '18px' }}>{ANIMAL_EMOJIS[activeView]}</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: isDark ? '#e2e8f0' : '#1e293b' }}>
              {viewMonth.name} — {viewMonth.season}
            </span>
            <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b', fontStyle: 'italic' }}>
              {viewMonth.term}
            </span>
            {activeView === birthMonthAnimal && (
              <span style={{
                fontSize: '9px', fontWeight: 700, color: '#facc15',
                background: 'rgba(250, 204, 21, 0.12)', padding: '2px 8px', borderRadius: '4px',
                border: '1px solid rgba(250, 204, 21, 0.3)',
              }}>
                ★ BIRTH MONTH
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Seasonal Weights:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.entries(displayMultipliers).map(([el, w]) => {
              const conf = ELEMENTS[el];
              const isPeak = w >= 1.0;
              const isStrong = w >= 0.8;
              return (
                <div key={el} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '8px',
                  background: isPeak ? `${conf.color}15` : isStrong ? `${conf.color}08` : 'transparent',
                  border: `1px solid ${isPeak ? `${conf.color}40` : isStrong ? `${conf.color}20` : (isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)')}`,
                }}>
                  <span style={{ fontSize: '14px' }}>{conf.emoji}</span>
                  <span style={{
                    fontSize: '12px', fontWeight: isPeak ? 800 : 600,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: isPeak ? conf.color : isStrong ? conf.color : (isDark ? '#94a3b8' : '#64748b'),
                  }}>
                    ×{w.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
        background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.8)',
        border: `1px solid ${isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.2)'}`
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Understanding the Chart
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '10px' }}>
          {[
            { color: isDark ? '#e2e8f0' : '#1e293b', label: `| ${viewMonth ? 'Seasonal' : 'Perfect'} Baseline`, desc: viewMonth ? `Optimal for ${viewMonth.name.split(' ')[0]}` : 'Optimal 22-21-20-19-18' },
            { color: '#3b82f6', label: '■ Deficient (<10%)',  desc: 'Needs tonification' },
            { color: '#f59e0b', label: '■ Low (10-15%)',      desc: 'Below balanced' },
            { color: '#10b981', label: '■ Balanced (15-25%)', desc: 'Healthy range' },
            { color: '#f59e0b', label: '■ High (25-30%)',     desc: 'Above balanced' },
            { color: '#ef4444', label: '■ Excess (>30%)',     desc: 'Needs regulation' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{ fontWeight: 700, color: item.color }}>{item.label}</span>
              <span style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Element bars */}
      {Object.keys(ELEMENTS).map(element => (
        <ElementBar
          key={element}
          element={element}
          userValue={displayElements?.[element] ?? 20}
          overallValue={userElements?.[element] ?? 20}
          expanded={expandedElements[element]}
          onToggle={() => toggleExpand(element)}
          onCalcClick={() => setCalcPopup({ element })}
          onChartClick={() => setChartPopup({ element })}
          themeMode={themeMode}
          userMonthBranch={monthBranch}
          weight={displayMultipliers?.[element]}
          perfectOverride={monthPerfects?.[element]}
        />
      ))}

      {/* Constitutional Summary */}
      <div style={{
        marginTop: '8px', padding: '14px 16px', borderRadius: '10px',
        background: isDark
          ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.06))'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(236, 72, 153, 0.04))',
        border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.15)'}`
      }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#c4b5fd' : '#7c3aed', marginBottom: '8px' }}>
          💡 {viewMonth ? `${viewMonth.name} Seasonal` : 'Constitutional'} Summary vs {viewMonth ? 'Seasonal' : 'Optimal'} Baseline
        </div>
        <div style={{ fontSize: '11px', color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.7 }}>
          {Object.entries(displayElements || {})
            .filter(([, val]) => val >= 30)
            .map(([elem, val]) => {
              const baseline = monthPerfects?.[elem] ?? ELEMENTS[elem]?.perfect;
              return (
                <div key={elem}>
                  • <strong style={{ color: ELEMENTS[elem]?.color }}>{ELEMENTS[elem]?.emoji} {ELEMENTS[elem]?.name} Excess</strong> ({val.toFixed(1)}% vs {typeof baseline === 'number' ? baseline.toFixed(1) : baseline}% optimal) — Consider regulation strategies
                </div>
              );
            })}
          {Object.entries(displayElements || {})
            .filter(([, val]) => val < 10)
            .map(([elem, val]) => {
              const baseline = monthPerfects?.[elem] ?? ELEMENTS[elem]?.perfect;
              return (
                <div key={elem}>
                  • <strong style={{ color: ELEMENTS[elem]?.color }}>{ELEMENTS[elem]?.emoji} {ELEMENTS[elem]?.name} Deficiency</strong> ({val.toFixed(1)}% vs {typeof baseline === 'number' ? baseline.toFixed(1) : baseline}% optimal) — Needs tonification support
                </div>
              );
            })}
          {Object.entries(displayElements || {})
            .filter(([, val]) => val >= 15 && val <= 25)
            .map(([elem, val]) => {
              const baseline = monthPerfects?.[elem] ?? ELEMENTS[elem]?.perfect;
              return (
                <div key={elem}>
                  • <strong style={{ color: ELEMENTS[elem]?.color }}>{ELEMENTS[elem]?.emoji} {ELEMENTS[elem]?.name} Balanced</strong> ({val.toFixed(1)}% vs {typeof baseline === 'number' ? baseline.toFixed(1) : baseline}% optimal) — Healthy maintenance ✓
                </div>
              );
            })}
          {Object.entries(displayElements || {})
            .filter(([, val]) => (val >= 10 && val < 15) || (val > 25 && val < 30))
            .map(([elem, val]) => {
              const baseline = monthPerfects?.[elem] ?? ELEMENTS[elem]?.perfect;
              return (
                <div key={elem}>
                  • <strong style={{ color: ELEMENTS[elem]?.color }}>{ELEMENTS[elem]?.emoji} {ELEMENTS[elem]?.name} Moderate</strong> ({val.toFixed(1)}% vs {typeof baseline === 'number' ? baseline.toFixed(1) : baseline}% optimal) — Within functional range
                </div>
              );
            })}
        </div>
      </div>

      {/* Calculation Popup — "Show Your Work" */}
      {calcPopup && (() => {
        // Determine which month to use for the calculation:
        // - If viewing a specific month tab, use that month
        // - If on Overall, use the birth month
        const calcMonth = activeView !== 'overall'
          ? activeView
          : (birthMonthAnimal || 'tiger');
        const raw = rawElements || userElements;
        return (
          <CalculationPopup
            month={calcMonth}
            element={calcPopup.element}
            userConstitution={raw}
            onClose={() => setCalcPopup(null)}
            themeMode={themeMode}
          />
        );
      })()}

      {/* Monthly Element Chart — 12-month line chart popup */}
      {chartPopup && (
        <MonthlyElementChart
          element={chartPopup.element}
          rawElements={rawElements || userElements}
          birthMonthAnimal={birthMonthAnimal}
          onClose={() => setChartPopup(null)}
          themeMode={themeMode}
        />
      )}
    </div>
  );
}
