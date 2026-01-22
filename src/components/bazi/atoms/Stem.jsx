/**
 * Stem Atom - Heavenly Stem Display
 * Displays a single Heavenly Stem character with styling
 */

import React from 'react';
import { useBaziTheme, getElementColor } from '../theme/BaziTheme';

// Stem data lookup
const STEM_DATA = {
  '甲': { english: 'Jia', element: 'Wood', polarity: 'Yang' },
  '乙': { english: 'Yi', element: 'Wood', polarity: 'Yin' },
  '丙': { english: 'Bing', element: 'Fire', polarity: 'Yang' },
  '丁': { english: 'Ding', element: 'Fire', polarity: 'Yin' },
  '戊': { english: 'Wu', element: 'Earth', polarity: 'Yang' },
  '己': { english: 'Ji', element: 'Earth', polarity: 'Yin' },
  '庚': { english: 'Geng', element: 'Metal', polarity: 'Yang' },
  '辛': { english: 'Xin', element: 'Metal', polarity: 'Yin' },
  '壬': { english: 'Ren', element: 'Water', polarity: 'Yang' },
  '癸': { english: 'Gui', element: 'Water', polarity: 'Yin' }
};

const Stem = ({
  value,          // Chinese character or English name
  element,        // Optional override for element
  large = false,
  showEnglish = false,
  showElement = false,
  onClick
}) => {
  const theme = useBaziTheme();

  // Resolve stem data
  const stemData = STEM_DATA[value] || Object.values(STEM_DATA).find(s => s.english === value);
  const displayChar = STEM_DATA[value] ? value : Object.keys(STEM_DATA).find(k => STEM_DATA[k].english === value) || value;
  const stemElement = element || stemData?.element || 'Unknown';
  const color = getElementColor(stemElement);

  const styles = {
    container: {
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      cursor: onClick ? 'pointer' : 'default'
    },
    character: {
      fontFamily: theme.typography.chinese,
      fontSize: large ? '2.5rem' : '1.5rem',
      fontWeight: 'bold',
      color: color,
      textShadow: `0 2px 8px ${color}40`,
      letterSpacing: '0.05em',
      transition: 'transform 0.2s, text-shadow 0.2s'
    },
    english: {
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily
    },
    element: {
      fontSize: '0.65rem',
      color: color,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    }
  };

  return (
    <div style={styles.container} onClick={onClick} title={stemData ? `${stemData.english} (${stemData.polarity} ${stemData.element})` : value}>
      <span style={styles.character}>{displayChar}</span>
      {showEnglish && stemData && <span style={styles.english}>{stemData.english}</span>}
      {showElement && <span style={styles.element}>{stemElement}</span>}
    </div>
  );
};

export default Stem;
