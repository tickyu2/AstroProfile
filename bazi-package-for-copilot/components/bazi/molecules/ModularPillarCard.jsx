/**
 * ModularPillarCard - Single Pillar Display
 * Composable card showing Year/Month/Day/Hour pillar
 * Uses atom components: Stem, Branch, ElementBadge
 */

import React from 'react';
import { useBaziTheme } from '../theme/BaziTheme';
import Stem from '../atoms/Stem';
import Branch from '../atoms/Branch';
import ElementBadge from '../atoms/ElementBadge';

const ModularPillarCard = ({
  label,            // 'Year' | 'Month' | 'Day' | 'Hour'
  pillar,           // { stem, branch, element?, ganZhi?, ages?, significance? }
  isYou = false,    // Highlight for Day pillar (Self)
  compact = false,
  showHiddenRoots = false,
  onClick
}) => {
  const theme = useBaziTheme();

  // Handle different data formats from the app
  const stemChar = typeof pillar.stem === 'object' ? pillar.stem.char : pillar.stem;
  const branchChar = typeof pillar.branch === 'object' ? pillar.branch.char : pillar.branch;
  const stemElement = typeof pillar.stem === 'object' ? pillar.stem.element : pillar.element;
  const branchElement = typeof pillar.branch === 'object' ? pillar.branch.element : null;

  const styles = {
    card: {
      background: theme.colors.card,
      borderRadius: theme.radius.lg,
      border: `1px solid ${isYou ? theme.colors.accent : theme.colors.border}`,
      padding: compact ? '12px' : '16px',
      minWidth: compact ? 100 : 130,
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 8 : 12,
      position: 'relative',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      boxShadow: isYou ? `0 0 20px ${theme.colors.accent}30` : theme.shadows.sm
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.colors.border}`,
      paddingBottom: compact ? 6 : 8,
      marginBottom: compact ? 4 : 8
    },
    label: {
      fontSize: compact ? '0.65rem' : '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: theme.colors.muted,
      fontWeight: 600,
      fontFamily: theme.typography.fontFamily
    },
    youBadge: {
      fontSize: '0.6rem',
      background: theme.colors.accent,
      color: '#fff',
      padding: '2px 6px',
      borderRadius: 4,
      fontWeight: 600
    },
    characters: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: compact ? 8 : 12,
      padding: compact ? '8px 0' : '12px 0'
    },
    elements: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      alignItems: 'center'
    },
    ganZhi: {
      fontSize: '0.7rem',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily
    },
    ages: {
      fontSize: '0.65rem',
      color: theme.colors.muted,
      textAlign: 'center',
      fontStyle: 'italic'
    },
    significance: {
      fontSize: '0.65rem',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 'auto',
      paddingTop: 8,
      borderTop: `1px solid ${theme.colors.border}`
    },
    hiddenRoots: {
      marginTop: 8,
      padding: 8,
      background: theme.colors.accentLight,
      borderRadius: theme.radius.sm,
      border: `1px dashed ${theme.colors.accent}`
    },
    hiddenTitle: {
      fontSize: '0.65rem',
      color: theme.colors.accent,
      fontWeight: 600,
      marginBottom: 6
    },
    rootRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4
    },
    rootStem: {
      fontSize: '0.85rem',
      fontFamily: theme.typography.chinese,
      width: 20,
      textAlign: 'center'
    },
    rootBar: {
      flex: 1,
      height: 4,
      background: theme.colors.border,
      borderRadius: 2,
      overflow: 'hidden'
    },
    rootPct: {
      fontSize: '0.6rem',
      color: theme.colors.muted,
      width: 28,
      textAlign: 'right'
    }
  };

  return (
    <div style={styles.card} onClick={onClick}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        {isYou && <span style={styles.youBadge}>YOU</span>}
      </div>

      {/* Main Characters */}
      <div style={styles.characters}>
        <Stem value={stemChar} element={stemElement} large={!compact} />
        <Branch value={branchChar} element={branchElement} large={!compact} />
      </div>

      {/* Element Badges */}
      {stemElement && (
        <div style={styles.elements}>
          <ElementBadge element={stemElement} size={compact ? 'sm' : 'md'} />
        </div>
      )}

      {/* GanZhi (if available) */}
      {pillar.ganZhi && (
        <div style={styles.ganZhi}>{pillar.ganZhi}</div>
      )}

      {/* Ages (if available) */}
      {pillar.ages && (
        <div style={styles.ages}>{pillar.ages}</div>
      )}

      {/* Hidden Roots (if enabled and available) */}
      {showHiddenRoots && pillar.hiddenRoots && pillar.hiddenRoots.length > 0 && (
        <div style={styles.hiddenRoots}>
          <div style={styles.hiddenTitle}>Hidden Depths</div>
          {pillar.hiddenRoots.map((root, i) => (
            <div key={i} style={styles.rootRow}>
              <span style={styles.rootStem}>{root.stem}</span>
              <div style={styles.rootBar}>
                <div style={{
                  width: `${root.pct}%`,
                  height: '100%',
                  background: theme.colors.accent,
                  borderRadius: 2
                }} />
              </div>
              <span style={styles.rootPct}>{root.pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Significance (if available) */}
      {pillar.significance && !compact && (
        <div style={styles.significance}>{pillar.significance}</div>
      )}
    </div>
  );
};

export default ModularPillarCard;
