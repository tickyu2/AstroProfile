/**
 * DayMasterCard - Day Master Display
 * Shows the Day Master (core identity) with element and strength
 */

import React from 'react';
import { useBaziTheme, getElementColor, getElementIcon } from '../theme/BaziTheme';
import Stem from '../atoms/Stem';
import ElementBadge from '../atoms/ElementBadge';

// Day Master descriptions
const DAY_MASTER_DESCRIPTIONS = {
  '甲': { name: 'Jia Wood', metaphor: 'The Great Tree', desc: 'Strong, upright, pioneering. Natural leader who stands tall.' },
  '乙': { name: 'Yi Wood', metaphor: 'The Vine/Flower', desc: 'Flexible, adaptive, artistic. Gentle strength that bends but never breaks.' },
  '丙': { name: 'Bing Fire', metaphor: 'The Sun', desc: 'Radiant, generous, expressive. Illuminates and warms everyone around.' },
  '丁': { name: 'Ding Fire', metaphor: 'The Candlelight', desc: 'Focused, passionate, precise. Intimate warmth that guides in darkness.' },
  '戊': { name: 'Wu Earth', metaphor: 'The Mountain', desc: 'Stable, reliable, grounding. Immovable foundation others depend on.' },
  '己': { name: 'Ji Earth', metaphor: 'The Garden Soil', desc: 'Nurturing, receptive, fertile. Creates conditions for growth.' },
  '庚': { name: 'Geng Metal', metaphor: 'The Sword/Axe', desc: 'Decisive, principled, cutting. Shapes the world with precision.' },
  '辛': { name: 'Xin Metal', metaphor: 'The Jewelry', desc: 'Refined, sensitive, elegant. Hidden value that reveals over time.' },
  '壬': { name: 'Ren Water', metaphor: 'The Ocean/River', desc: 'Powerful, flowing, deep. Carves canyons and moves continents.' },
  '癸': { name: 'Gui Water', metaphor: 'The Rain/Dew', desc: 'Intuitive, perceptive, cleansing. Nourishes all living things.' }
};

const DayMasterCard = ({
  dayMaster,          // { stem, branch?, element, fullName?, chinese? }
  strengthLabel,      // e.g., "Resource-Abundant Metal"
  showMetaphor = true,
  showDescription = true,
  compact = false
}) => {
  const theme = useBaziTheme();

  // Extract stem character
  const stemChar = typeof dayMaster.stem === 'object' ? dayMaster.stem.char : dayMaster.stem;
  const element = dayMaster.element || (typeof dayMaster.stem === 'object' ? dayMaster.stem.element : null);
  const color = getElementColor(element);
  const masterInfo = DAY_MASTER_DESCRIPTIONS[stemChar];

  const styles = {
    card: {
      background: `linear-gradient(135deg, ${theme.colors.card} 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      borderRadius: theme.radius.xl,
      padding: compact ? 16 : 24,
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? 12 : 16,
      boxShadow: `0 4px 20px ${color}20`
    },
    header: {
      textAlign: 'center'
    },
    title: {
      fontSize: compact ? '0.7rem' : '0.8rem',
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      color: theme.colors.muted,
      marginBottom: 8
    },
    stemContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12
    },
    fullName: {
      fontSize: compact ? '1.1rem' : '1.4rem',
      fontWeight: 700,
      color: color,
      textShadow: `0 2px 12px ${color}40`
    },
    metaphor: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center',
      marginTop: 8
    },
    metaphorText: {
      fontSize: compact ? '0.85rem' : '1rem',
      fontWeight: 600,
      color: theme.colors.text,
      fontStyle: 'italic'
    },
    metaphorIcon: {
      fontSize: compact ? '1.2rem' : '1.5rem'
    },
    description: {
      fontSize: compact ? '0.75rem' : '0.85rem',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 1.6,
      padding: '0 8px'
    },
    strength: {
      fontSize: compact ? '0.7rem' : '0.8rem',
      color: theme.colors.muted,
      textAlign: 'center',
      padding: '8px 12px',
      background: theme.colors.cardLight,
      borderRadius: theme.radius.md,
      marginTop: 8
    },
    chinese: {
      fontSize: compact ? '0.7rem' : '0.75rem',
      color: theme.colors.muted,
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>Day Master</div>
      </div>

      {/* Stem Display */}
      <div style={styles.stemContainer}>
        <Stem value={stemChar} element={element} large />
        <ElementBadge element={element} size="lg" variant="subtle" showIcon />
      </div>

      {/* Full Name */}
      {(dayMaster.fullName || masterInfo) && (
        <div style={styles.fullName}>
          {dayMaster.fullName || masterInfo?.name}
        </div>
      )}

      {/* Metaphor */}
      {showMetaphor && masterInfo && (
        <div style={styles.metaphor}>
          <span style={styles.metaphorIcon}>{getElementIcon(element)}</span>
          <span style={styles.metaphorText}>{masterInfo.metaphor}</span>
        </div>
      )}

      {/* Description */}
      {showDescription && masterInfo && (
        <div style={styles.description}>
          {masterInfo.desc}
        </div>
      )}

      {/* Strength Label */}
      {strengthLabel && (
        <div style={styles.strength}>
          {strengthLabel}
        </div>
      )}

      {/* Chinese Name (if provided) */}
      {dayMaster.chinese && (
        <div style={styles.chinese}>{dayMaster.chinese}</div>
      )}
    </div>
  );
};

export default DayMasterCard;
