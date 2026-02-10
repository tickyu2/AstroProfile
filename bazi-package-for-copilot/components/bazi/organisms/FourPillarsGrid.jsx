/**
 * FourPillarsGrid - Complete Four Pillars Display
 * Renders all four pillars (Year, Month, Day, Hour) in a grid
 * Uses ModularPillarCard molecule
 */

import React from 'react';
import { useBaziTheme } from '../theme/BaziTheme';
import ModularPillarCard from '../molecules/ModularPillarCard';

const FourPillarsGrid = ({
  pillars,            // Array of 4 pillars OR object { year, month, day, hour }
  compact = false,
  showHiddenRoots = false,
  onPillarClick
}) => {
  const theme = useBaziTheme();

  // Normalize pillars to array format
  let pillarsArray;
  if (Array.isArray(pillars)) {
    pillarsArray = pillars;
  } else if (pillars?.year && pillars?.month && pillars?.day && pillars?.hour) {
    pillarsArray = [
      { ...pillars.year, name: 'Year' },
      { ...pillars.month, name: 'Month' },
      { ...pillars.day, name: 'Day' },
      { ...pillars.hour, name: 'Hour' }
    ];
  } else {
    return null;
  }

  const labels = ['Year', 'Month', 'Day', 'Hour'];

  const styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: compact ? 'repeat(4, 1fr)' : 'repeat(4, minmax(130px, 1fr))',
      gap: compact ? 8 : 16,
      padding: compact ? 8 : 16,
      background: theme.colors.background,
      borderRadius: theme.radius.xl,
      border: `1px solid ${theme.colors.border}`
    },
    // Responsive: stack on small screens
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(2, 1fr)'
    }
  };

  return (
    <div style={styles.container}>
      {pillarsArray.map((pillar, index) => (
        <ModularPillarCard
          key={labels[index]}
          label={pillar.name || labels[index]}
          pillar={pillar}
          isYou={index === 2} // Day pillar is "You"
          compact={compact}
          showHiddenRoots={showHiddenRoots}
          onClick={onPillarClick ? () => onPillarClick(pillar, index) : undefined}
        />
      ))}
    </div>
  );
};

export default FourPillarsGrid;
