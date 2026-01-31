/**
 * ============================================================================
 * QI MEN DUN JIA GRID (奇门遁甲九宫格)
 * ============================================================================
 *
 * A 3×3 palace grid showing:
 * - Door (门)
 * - Star (星)
 * - Deity (神)
 * - Stem (干)
 * - Formation (格局)
 * - Rating
 *
 * Created: January 2026
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import type { QiMenPalaceDisplay, EnvironmentalSnapshot, DashboardTheme } from '../storyDashboardTypes';
import { CATHEDRAL_THEME } from '../storyDashboardTypes';

// ============================================================================
// TYPES
// ============================================================================

interface QiMenGridProps {
  snapshots: EnvironmentalSnapshot[];
  selectedTime?: string;
  onPalaceClick?: (palace: QiMenPalaceDisplay) => void;
  theme?: DashboardTheme;
  compact?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Palace positions in the 3×3 grid (Luo Shu arrangement)
 */
const PALACE_POSITIONS: Record<number, { row: number; col: number; position: string }> = {
  4: { row: 0, col: 0, position: 'SE' },
  9: { row: 0, col: 1, position: 'S' },
  2: { row: 0, col: 2, position: 'SW' },
  3: { row: 1, col: 0, position: 'E' },
  5: { row: 1, col: 1, position: 'CENTER' },
  7: { row: 1, col: 2, position: 'W' },
  8: { row: 2, col: 0, position: 'NE' },
  1: { row: 2, col: 1, position: 'N' },
  6: { row: 2, col: 2, position: 'NW' }
};

const RATING_COLORS: Record<string, string> = {
  excellent: '#22c55e',
  good: '#3b82f6',
  mixed: '#a855f7',
  caution: '#f59e0b',
  challenging: '#ef4444'
};

const NATURE_ICONS: Record<string, string> = {
  auspicious: '✓',
  neutral: '○',
  inauspicious: '✗'
};

// ============================================================================
// PALACE CELL COMPONENT
// ============================================================================

interface PalaceCellProps {
  palace: QiMenPalaceDisplay;
  onClick?: () => void;
  theme: DashboardTheme;
  compact: boolean;
  isSelected: boolean;
}

const PalaceCell: React.FC<PalaceCellProps> = ({
  palace,
  onClick,
  theme,
  compact,
  isSelected
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const ratingColor = RATING_COLORS[palace.rating];
  const isCenter = palace.position === 'CENTER';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '8px' : '12px',
        backgroundColor: isCenter
          ? 'rgba(168, 85, 247, 0.15)'
          : isSelected
            ? 'rgba(251, 191, 36, 0.15)'
            : isHovered
              ? 'rgba(255, 255, 255, 0.05)'
              : 'transparent',
        border: `1px solid ${isSelected ? theme.colors.gold : theme.colors.border}`,
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: compact ? '80px' : '120px'
      }}
    >
      {/* Key Palace Indicator */}
      {palace.isKeyPalace && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: theme.colors.gold,
            boxShadow: `0 0 8px ${theme.colors.gold}`
          }}
        />
      )}

      {/* Palace Number */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          fontSize: '10px',
          color: theme.colors.textMuted,
          fontWeight: 'bold'
        }}
      >
        {palace.number}
      </div>

      {/* Position Label */}
      <div
        style={{
          fontSize: compact ? '9px' : '10px',
          color: theme.colors.textMuted,
          marginBottom: '4px'
        }}
      >
        {palace.position}
      </div>

      {/* Door */}
      <div
        style={{
          fontSize: compact ? '14px' : '18px',
          fontWeight: 'bold',
          color: palace.door.nature === 'auspicious'
            ? theme.colors.excellent
            : palace.door.nature === 'inauspicious'
              ? theme.colors.caution
              : theme.colors.text
        }}
      >
        {palace.door.nameChinese}
      </div>

      {/* Star */}
      {!compact && (
        <div
          style={{
            fontSize: '12px',
            color: palace.star.nature === 'auspicious'
              ? theme.colors.good
              : theme.colors.textMuted,
            marginTop: '4px'
          }}
        >
          {palace.star.nameChinese}
        </div>
      )}

      {/* Deity */}
      {!compact && palace.deity && (
        <div
          style={{
            fontSize: '11px',
            color: theme.colors.textMuted,
            marginTop: '2px'
          }}
        >
          {palace.deity.nameChinese}
        </div>
      )}

      {/* Stem */}
      {palace.stem && (
        <div
          style={{
            fontSize: compact ? '10px' : '12px',
            color: theme.colors.accent,
            marginTop: '4px',
            padding: '2px 6px',
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '4px'
          }}
        >
          {palace.stem.char}
        </div>
      )}

      {/* Rating Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: compact ? '30px' : '40px',
          height: '3px',
          backgroundColor: ratingColor,
          borderRadius: '2px',
          opacity: 0.7
        }}
      />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const QiMenGrid: React.FC<QiMenGridProps> = ({
  snapshots,
  selectedTime,
  onPalaceClick,
  theme = CATHEDRAL_THEME,
  compact = false
}) => {
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);

  // Get current snapshot
  const currentSnapshot = useMemo(() => {
    if (!snapshots || snapshots.length === 0) return null;

    if (selectedTime) {
      return snapshots.find(s => s.timestamp.startsWith(selectedTime)) || snapshots[0];
    }

    return snapshots[0];
  }, [snapshots, selectedTime]);

  // Build grid from palaces
  const grid = useMemo(() => {
    if (!currentSnapshot?.qiMen?.palaces) return null;

    const gridArray: (QiMenPalaceDisplay | null)[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];

    currentSnapshot.qiMen.palaces.forEach(palace => {
      const pos = PALACE_POSITIONS[palace.number];
      if (pos) {
        gridArray[pos.row][pos.col] = palace;
      }
    });

    return gridArray;
  }, [currentSnapshot]);

  if (!currentSnapshot || !grid) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: theme.colors.textMuted,
          backgroundColor: theme.colors.surface,
          borderRadius: '12px'
        }}
      >
        No Qi Men data available
      </div>
    );
  }

  const handlePalaceClick = (palace: QiMenPalaceDisplay) => {
    setSelectedPalace(palace.number);
    onPalaceClick?.(palace);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Formation Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          padding: '8px 12px',
          backgroundColor: theme.colors.surface,
          borderRadius: '8px',
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: theme.colors.textMuted }}>Formation: </span>
          <span style={{ fontSize: '14px', color: theme.colors.gold, fontWeight: 'bold' }}>
            {currentSnapshot.qiMen.formationChinese}
          </span>
          <span style={{ fontSize: '12px', color: theme.colors.textMuted, marginLeft: '8px' }}>
            ({currentSnapshot.qiMen.formation})
          </span>
        </div>
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            backgroundColor: RATING_COLORS[currentSnapshot.qiMen.rating] + '20',
            color: RATING_COLORS[currentSnapshot.qiMen.rating],
            border: `1px solid ${RATING_COLORS[currentSnapshot.qiMen.rating]}40`
          }}
        >
          {currentSnapshot.qiMen.rating}
        </div>
      </div>

      {/* 3x3 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          backgroundColor: theme.colors.surface,
          padding: '12px',
          borderRadius: '12px'
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((palace, colIndex) => {
            if (!palace) {
              return (
                <div
                  key={`empty-${rowIndex}-${colIndex}`}
                  style={{
                    minHeight: compact ? '80px' : '120px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px'
                  }}
                />
              );
            }

            return (
              <PalaceCell
                key={palace.number}
                palace={palace}
                onClick={() => handlePalaceClick(palace)}
                theme={theme}
                compact={compact}
                isSelected={selectedPalace === palace.number}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      {!compact && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '12px',
            fontSize: '10px',
            color: theme.colors.textMuted
          }}
        >
          <span>门 = Door</span>
          <span>星 = Star</span>
          <span>神 = Deity</span>
          <span>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: theme.colors.gold,
                marginRight: '4px'
              }}
            />
            Key Palace
          </span>
        </div>
      )}

      {/* Selected Palace Details */}
      {selectedPalace && !compact && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            borderRadius: '8px',
            border: `1px solid rgba(251, 191, 36, 0.2)`
          }}
        >
          {(() => {
            const palace = currentSnapshot.qiMen.palaces.find(p => p.number === selectedPalace);
            if (!palace) return null;

            return (
              <>
                <div style={{ fontSize: '14px', color: theme.colors.gold, fontWeight: 'bold' }}>
                  Palace {palace.number} ({palace.position})
                </div>
                <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: theme.colors.textMuted }}>Door: </span>
                    <span style={{ color: theme.colors.text }}>{palace.door.name} ({palace.door.nameChinese})</span>
                    <span style={{ marginLeft: '4px' }}>{NATURE_ICONS[palace.door.nature]}</span>
                  </div>
                  <div>
                    <span style={{ color: theme.colors.textMuted }}>Star: </span>
                    <span style={{ color: theme.colors.text }}>{palace.star.name} ({palace.star.nameChinese})</span>
                    <span style={{ marginLeft: '4px' }}>{NATURE_ICONS[palace.star.nature]}</span>
                  </div>
                  {palace.deity && (
                    <div>
                      <span style={{ color: theme.colors.textMuted }}>Deity: </span>
                      <span style={{ color: theme.colors.text }}>{palace.deity.name} ({palace.deity.nameChinese})</span>
                    </div>
                  )}
                  {palace.stem && (
                    <div>
                      <span style={{ color: theme.colors.textMuted }}>Stem: </span>
                      <span style={{ color: theme.colors.text }}>{palace.stem.char} ({palace.stem.element})</span>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default QiMenGrid;
