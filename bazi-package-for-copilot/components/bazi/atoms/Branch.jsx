/**
 * Branch Atom - Earthly Branch Display
 * Displays a single Earthly Branch character with animal and element
 */

import React from 'react';
import { useBaziTheme, getElementColor } from '../theme/BaziTheme';

// Branch data lookup
const BRANCH_DATA = {
  '子': { english: 'Zi', animal: 'Rat', element: 'Water', polarity: 'Yang' },
  '丑': { english: 'Chou', animal: 'Ox', element: 'Earth', polarity: 'Yin' },
  '寅': { english: 'Yin', animal: 'Tiger', element: 'Wood', polarity: 'Yang' },
  '卯': { english: 'Mao', animal: 'Rabbit', element: 'Wood', polarity: 'Yin' },
  '辰': { english: 'Chen', animal: 'Dragon', element: 'Earth', polarity: 'Yang' },
  '巳': { english: 'Si', animal: 'Snake', element: 'Fire', polarity: 'Yin' },
  '午': { english: 'Wu', animal: 'Horse', element: 'Fire', polarity: 'Yang' },
  '未': { english: 'Wei', animal: 'Goat', element: 'Earth', polarity: 'Yin' },
  '申': { english: 'Shen', animal: 'Monkey', element: 'Metal', polarity: 'Yang' },
  '酉': { english: 'You', animal: 'Rooster', element: 'Metal', polarity: 'Yin' },
  '戌': { english: 'Xu', animal: 'Dog', element: 'Earth', polarity: 'Yang' },
  '亥': { english: 'Hai', animal: 'Pig', element: 'Water', polarity: 'Yin' }
};

// Animal emojis
const ANIMAL_EMOJIS = {
  Rat: '🐀', Ox: '🐂', Tiger: '🐅', Rabbit: '🐇',
  Dragon: '🐉', Snake: '🐍', Horse: '🐎', Goat: '🐐',
  Monkey: '🐒', Rooster: '🐓', Dog: '🐕', Pig: '🐷'
};

const Branch = ({
  value,          // Chinese character or English name
  element,        // Optional override for element
  large = false,
  showAnimal = false,
  showElement = false,
  showEmoji = false,
  onClick
}) => {
  const theme = useBaziTheme();

  // Resolve branch data
  const branchData = BRANCH_DATA[value] || Object.values(BRANCH_DATA).find(b => b.english === value || b.animal === value);
  const displayChar = BRANCH_DATA[value] ? value : Object.keys(BRANCH_DATA).find(k => BRANCH_DATA[k].english === value || BRANCH_DATA[k].animal === value) || value;
  const branchElement = element || branchData?.element || 'Unknown';
  const color = getElementColor(branchElement);

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
    animal: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      fontSize: '0.75rem',
      color: theme.colors.textSecondary,
      fontFamily: theme.typography.fontFamily
    },
    emoji: {
      fontSize: '1rem'
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
    <div style={styles.container} onClick={onClick} title={branchData ? `${branchData.animal} (${branchData.polarity} ${branchData.element})` : value}>
      <span style={styles.character}>{displayChar}</span>
      {(showAnimal || showEmoji) && branchData && (
        <span style={styles.animal}>
          {showEmoji && <span style={styles.emoji}>{ANIMAL_EMOJIS[branchData.animal]}</span>}
          {showAnimal && branchData.animal}
        </span>
      )}
      {showElement && <span style={styles.element}>{branchElement}</span>}
    </div>
  );
};

export default Branch;
