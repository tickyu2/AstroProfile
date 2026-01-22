/**
 * ModularPillarCard - Single Pillar Display
 * Composable card showing Year/Month/Day/Hour pillar
 * Uses atom components: Stem, Branch, ElementBadge
 */

import React, { useState } from 'react';
import { useBaziTheme } from '../theme/BaziTheme';
import Stem from '../atoms/Stem';
import Branch from '../atoms/Branch';
import ElementBadge from '../atoms/ElementBadge';

// Element colors for progress bars
const ELEMENT_COLORS = {
  Wood: '#22c55e',
  Fire: '#ef4444',
  Earth: '#f59e0b',
  Metal: '#a1a1aa',
  Water: '#3b82f6'
};

// Stem Chinese to English mapping (polarity + element)
const STEM_ENGLISH = {
  '甲': { pinyin: 'Jiǎ', full: 'Yang Wood' },
  '乙': { pinyin: 'Yǐ', full: 'Yin Wood' },
  '丙': { pinyin: 'Bǐng', full: 'Yang Fire' },
  '丁': { pinyin: 'Dīng', full: 'Yin Fire' },
  '戊': { pinyin: 'Wù', full: 'Yang Earth' },
  '己': { pinyin: 'Jǐ', full: 'Yin Earth' },
  '庚': { pinyin: 'Gēng', full: 'Yang Metal' },
  '辛': { pinyin: 'Xīn', full: 'Yin Metal' },
  '壬': { pinyin: 'Rén', full: 'Yang Water' },
  '癸': { pinyin: 'Guǐ', full: 'Yin Water' }
};

// Branch Chinese to English mapping (zodiac animal)
const BRANCH_ENGLISH = {
  '子': { pinyin: 'Zǐ', full: 'Rat' },
  '丑': { pinyin: 'Chǒu', full: 'Ox' },
  '寅': { pinyin: 'Yín', full: 'Tiger' },
  '卯': { pinyin: 'Mǎo', full: 'Rabbit' },
  '辰': { pinyin: 'Chén', full: 'Dragon' },
  '巳': { pinyin: 'Sì', full: 'Snake' },
  '午': { pinyin: 'Wǔ', full: 'Horse' },
  '未': { pinyin: 'Wèi', full: 'Goat' },
  '申': { pinyin: 'Shēn', full: 'Monkey' },
  '酉': { pinyin: 'Yǒu', full: 'Rooster' },
  '戌': { pinyin: 'Xū', full: 'Dog' },
  '亥': { pinyin: 'Hài', full: 'Pig' }
};

const ModularPillarCard = ({
  label,            // 'Year' | 'Month' | 'Day' | 'Hour'
  pillar,           // { stem, branch, element?, ganZhi?, ages?, significance? }
  isYou = false,    // Highlight for Day pillar (Self)
  compact = false,
  showHiddenRoots = false,
  onClick
}) => {
  const theme = useBaziTheme();
  const [showHiddenExplanation, setShowHiddenExplanation] = useState(false);

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
    charWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: compact ? 1 : 2
    },
    fullLabel: {
      fontSize: compact ? '0.55rem' : '0.65rem',
      color: theme.colors.text,
      fontWeight: 600,
      letterSpacing: '0.02em',
      fontFamily: theme.typography.fontFamily,
      textAlign: 'center',
      lineHeight: 1.2
    },
    pinyinLabel: {
      fontSize: compact ? '0.5rem' : '0.55rem',
      color: theme.colors.muted,
      fontWeight: 400,
      fontStyle: 'italic',
      fontFamily: theme.typography.fontFamily
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
      padding: 10,
      background: `linear-gradient(135deg, ${theme.colors.card} 0%, ${theme.colors.cardLight || theme.colors.card}40 100%)`,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.border}`
    },
    hiddenHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      marginBottom: 8
    },
    hiddenTitle: {
      fontSize: '0.65rem',
      color: theme.colors.accent,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    },
    hiddenToggle: {
      fontSize: '0.5rem',
      color: theme.colors.muted,
      padding: '2px 6px',
      borderRadius: 4,
      background: theme.colors.border,
      cursor: 'pointer'
    },
    hiddenExplanation: {
      fontSize: '0.6rem',
      color: theme.colors.textSecondary,
      lineHeight: 1.4,
      padding: '8px 0',
      marginBottom: 8,
      borderBottom: `1px dashed ${theme.colors.border}`
    },
    rootRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
      padding: '4px 0'
    },
    rootStemWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: 45
    },
    rootStem: {
      fontSize: '0.9rem',
      fontFamily: theme.typography.chinese,
      textAlign: 'center'
    },
    rootEnglish: {
      fontSize: '0.5rem',
      color: theme.colors.muted,
      textAlign: 'center',
      whiteSpace: 'nowrap'
    },
    rootBarContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    },
    rootBar: {
      height: 6,
      background: theme.colors.border,
      borderRadius: 3,
      overflow: 'hidden'
    },
    rootPct: {
      fontSize: '0.6rem',
      color: theme.colors.text,
      fontWeight: 600,
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

      {/* Main Characters with English labels */}
      <div style={styles.characters}>
        <div style={styles.charWrapper}>
          <span style={styles.fullLabel}>{STEM_ENGLISH[stemChar]?.full || stemChar}</span>
          <span style={styles.pinyinLabel}>{STEM_ENGLISH[stemChar]?.pinyin || ''}</span>
          <Stem value={stemChar} element={stemElement} large={!compact} />
        </div>
        <div style={styles.charWrapper}>
          <span style={styles.fullLabel}>{BRANCH_ENGLISH[branchChar]?.full || branchChar}</span>
          <span style={styles.pinyinLabel}>{BRANCH_ENGLISH[branchChar]?.pinyin || ''}</span>
          <Branch value={branchChar} element={branchElement} large={!compact} />
        </div>
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

      {/* Hidden Roots (藏干) - The hidden stems within each branch */}
      {showHiddenRoots && pillar.hiddenRoots && pillar.hiddenRoots.length > 0 && (
        <div style={styles.hiddenRoots}>
          {/* Clickable header */}
          <div
            style={styles.hiddenHeader}
            onClick={(e) => { e.stopPropagation(); setShowHiddenExplanation(!showHiddenExplanation); }}
          >
            <span style={styles.hiddenTitle}>
              <span>🔮</span>
              <span>Hidden Depths (藏干)</span>
            </span>
            <span style={styles.hiddenToggle}>
              {showHiddenExplanation ? '▲ Less' : '▼ More'}
            </span>
          </div>

          {/* Expandable explanation */}
          {showHiddenExplanation && (
            <div style={styles.hiddenExplanation}>
              Each Earthly Branch contains hidden Heavenly Stems that represent the internal energy composition.
              The percentages show the relative strength of each hidden element within the {BRANCH_ENGLISH[branchChar]?.full || 'branch'} ({branchChar}).
              These hidden stems influence your chart's total elemental balance.
            </div>
          )}

          {/* Hidden stems with element-colored bars */}
          {pillar.hiddenRoots.map((root, i) => {
            const stemInfo = STEM_ENGLISH[root.stem];
            const elementName = stemInfo?.full?.split(' ')[1] || 'Earth'; // Extract element from "Yang Wood" etc
            const elementColor = ELEMENT_COLORS[elementName] || theme.colors.accent;

            return (
              <div key={i} style={styles.rootRow}>
                <div style={styles.rootStemWrapper}>
                  <span style={{...styles.rootStem, color: elementColor}}>{root.stem}</span>
                  <span style={styles.rootEnglish}>{stemInfo?.full || root.stem}</span>
                </div>
                <div style={styles.rootBarContainer}>
                  <div style={styles.rootBar}>
                    <div style={{
                      width: `${root.pct}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${elementColor} 0%, ${elementColor}cc 100%)`,
                      borderRadius: 3,
                      boxShadow: `0 0 4px ${elementColor}50`
                    }} />
                  </div>
                </div>
                <span style={{...styles.rootPct, color: elementColor}}>{root.pct}%</span>
              </div>
            );
          })}
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
