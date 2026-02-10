// Quality Categories Definition
// Defines all the qualities we measure across Aries zones

export const qualityCategories = [
  {
    id: 'courage',
    label: 'Courage',
    icon: '🗡️',
    maxLevel: 5,
    description: 'Fearless bravery in the face of challenge — core Aries trait',
    lowDescription: 'Cautious, calculates before acting',
    highDescription: 'Absolutely fearless, charges into any battle'
  },
  {
    id: 'impulsivity',
    label: 'Impulsivity',
    icon: '⚡',
    maxLevel: 5,
    description: 'Tendency to act immediately without forethought',
    lowDescription: 'Considers consequences before acting',
    highDescription: 'Acts on pure instinct, zero hesitation'
  },
  {
    id: 'competitiveness',
    label: 'Competitiveness',
    icon: '🏆',
    maxLevel: 5,
    description: 'Drive to win and outperform others — Mars fuel',
    lowDescription: 'Collaborative, shares the stage',
    highDescription: 'Must win at everything, ruthless competitor'
  },
  {
    id: 'directness',
    label: 'Directness',
    icon: '🎯',
    maxLevel: 5,
    description: 'Straightforward, unfiltered honesty in communication',
    lowDescription: 'Diplomatic, softens the message',
    highDescription: 'Brutally honest, no sugar-coating'
  },
  {
    id: 'pioneering',
    label: 'Pioneering Spirit',
    icon: '🚀',
    maxLevel: 5,
    description: 'Drive to be first and explore uncharted territory',
    lowDescription: 'Follows established paths',
    highDescription: 'Must be the first, blazes every trail'
  },
  {
    id: 'aggression',
    label: 'Aggression',
    icon: '⚔️',
    maxLevel: 5,
    description: 'Mars-driven assertive and combative energy',
    lowDescription: 'Assertive only when necessary',
    highDescription: 'Born fighter, competitive in everything'
  },
  {
    id: 'speed',
    label: 'Speed/Tempo',
    icon: '💨',
    maxLevel: 5,
    description: 'How quickly you move through decisions and actions',
    lowDescription: 'Thoughtful deliberation before action',
    highDescription: 'Lightning-fast decisions and instant action'
  },
  {
    id: 'patience',
    label: 'Patience',
    icon: '⏳',
    maxLevel: 5,
    description: 'Ability to wait and persist — varies across Aries',
    lowDescription: 'Restless, needs immediate results',
    highDescription: 'Can sustain effort when driven by purpose'
  },
  {
    id: 'stubbornness',
    label: 'Stubbornness',
    icon: '🐏',
    maxLevel: 5,
    description: 'Resistance to changing course once committed',
    lowDescription: 'Flexible and open to new directions',
    highDescription: 'Immovable once the charge begins'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Willingness to leap into unknown territory',
    lowDescription: 'Prefers calculated moves',
    highDescription: 'Dives headfirst into the unknown'
  }
];

// Quality comparison helper functions
export const getQualityColor = (level) => {
  if (level >= 80) return '#4CAF50'; // High - Green
  if (level >= 60) return '#8BC34A'; // Medium-High - Light Green
  if (level >= 40) return '#FFC107'; // Medium - Amber
  if (level >= 20) return '#FF9800'; // Low-Medium - Orange
  return '#F44336'; // Low - Red
};

export const getQualityLabel = (level) => {
  if (level >= 90) return 'Very High';
  if (level >= 70) return 'High';
  if (level >= 50) return 'Medium';
  if (level >= 30) return 'Low-Medium';
  return 'Low';
};

export const compareQualityAcrossZones = (zones, qualityId) => {
  const levels = zones.map(zone => zone.qualities[qualityId].level);
  const max = Math.max(...levels);
  const min = Math.min(...levels);
  const range = max - min;
  const avg = levels.reduce((a, b) => a + b, 0) / levels.length;

  return {
    range,
    max,
    min,
    avg: Math.round(avg),
    maxZone: zones.find(z => z.qualities[qualityId].level === max),
    minZone: zones.find(z => z.qualities[qualityId].level === min)
  };
};

export default qualityCategories;
