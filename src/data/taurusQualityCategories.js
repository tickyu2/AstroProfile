// Quality Categories Definition
// Defines all the qualities we measure across Taurus zones

export const qualityCategories = [
  {
    id: 'practicalSkills',
    label: 'Practical Skills',
    icon: '🔨',
    maxLevel: 5,
    description: 'Mastery of tangible, material-world craftsmanship — core Taurus trait',
    lowDescription: 'Theoretical rather than hands-on',
    highDescription: 'Master builder and craftsperson'
  },
  {
    id: 'sensoryAwareness',
    label: 'Sensory Awareness',
    icon: '🌹',
    maxLevel: 5,
    description: 'Appreciation of beauty through the five senses — Venus gift',
    lowDescription: 'Functional over beautiful',
    highDescription: 'Exquisite taste in all things'
  },
  {
    id: 'loyalty',
    label: 'Loyalty',
    icon: '💎',
    maxLevel: 5,
    description: 'Steadfast devotion and commitment to people and values',
    lowDescription: 'Flexible in attachments',
    highDescription: 'Unmovable, lifelong devotion'
  },
  {
    id: 'materialFocus',
    label: 'Material Focus',
    icon: '💰',
    maxLevel: 5,
    description: 'Drive toward financial security and material accumulation',
    lowDescription: 'Values experiences over possessions',
    highDescription: 'Masters the material world completely'
  },
  {
    id: 'aestheticSense',
    label: 'Aesthetic Sense',
    icon: '🎨',
    maxLevel: 5,
    description: 'Innate sense of beauty, harmony, and refined taste',
    lowDescription: 'Functional over aesthetic',
    highDescription: 'Perfect taste and artistic refinement'
  },
  {
    id: 'reliability',
    label: 'Reliability',
    icon: '🏛️',
    maxLevel: 5,
    description: 'Dependability and consistency that others can count on',
    lowDescription: 'Flexible commitment level',
    highDescription: 'Rock-solid, never fails to deliver'
  },
  {
    id: 'speed',
    label: 'Speed/Tempo',
    icon: '💨',
    maxLevel: 5,
    description: 'How quickly decisions and actions unfold',
    lowDescription: 'Deliberately slow and methodical',
    highDescription: 'Surprisingly quick when motivated'
  },
  {
    id: 'patience',
    label: 'Patience',
    icon: '⏳',
    maxLevel: 5,
    description: 'Ability to wait, endure, and persist — legendary in Taurus',
    lowDescription: 'Needs results within reasonable time',
    highDescription: 'Infinite patience, will wait decades'
  },
  {
    id: 'stubbornness',
    label: 'Stubbornness',
    icon: '🐂',
    maxLevel: 5,
    description: 'Resistance to changing course — THE Taurus trademark',
    lowDescription: 'Surprisingly flexible',
    highDescription: 'Absolutely immovable force'
  },
  {
    id: 'riskTolerance',
    label: 'Risk Tolerance',
    icon: '🎲',
    maxLevel: 5,
    description: 'Comfort with uncertainty and venturing beyond security',
    lowDescription: 'Conservative, protects what exists',
    highDescription: 'Can embrace calculated risk'
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
