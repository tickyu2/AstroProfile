/**
 * ElementBadge Atom - Five Elements Badge
 * Color-coded badge showing element with dot indicator
 */

import React from 'react';
import { useBaziTheme, getElementColor, getElementIcon } from '../theme/BaziTheme';

const ElementBadge = ({
  element,              // 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water'
  label,                // Custom label (defaults to element name)
  size = 'md',          // 'sm' | 'md' | 'lg'
  showIcon = false,
  showDot = true,
  variant = 'outlined', // 'outlined' | 'filled' | 'subtle'
  onClick
}) => {
  const theme = useBaziTheme();
  const color = getElementColor(element);

  const sizes = {
    sm: { padding: '2px 6px', fontSize: '0.65rem', dotSize: 6, iconSize: '0.7rem' },
    md: { padding: '4px 10px', fontSize: '0.75rem', dotSize: 8, iconSize: '0.85rem' },
    lg: { padding: '6px 14px', fontSize: '0.85rem', dotSize: 10, iconSize: '1rem' }
  };

  const sizeConfig = sizes[size];

  const variants = {
    outlined: {
      background: 'transparent',
      border: `1px solid ${color}`,
      color: color
    },
    filled: {
      background: color,
      border: `1px solid ${color}`,
      color: '#ffffff'
    },
    subtle: {
      background: `${color}20`,
      border: `1px solid ${color}40`,
      color: color
    }
  };

  const variantStyle = variants[variant];

  const styles = {
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: sizeConfig.padding,
      borderRadius: 999,
      fontSize: sizeConfig.fontSize,
      fontWeight: 500,
      fontFamily: theme.typography.fontFamily,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.2s',
      ...variantStyle
    },
    dot: {
      width: sizeConfig.dotSize,
      height: sizeConfig.dotSize,
      borderRadius: '50%',
      backgroundColor: variant === 'filled' ? '#ffffff' : color,
      flexShrink: 0
    },
    icon: {
      fontSize: sizeConfig.iconSize,
      lineHeight: 1
    }
  };

  return (
    <span style={styles.badge} onClick={onClick} title={`${element} Element`}>
      {showDot && <span style={styles.dot} />}
      {showIcon && <span style={styles.icon}>{getElementIcon(element)}</span>}
      {label || element}
    </span>
  );
};

export default ElementBadge;
